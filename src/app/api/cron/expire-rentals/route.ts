import { createAdminClient } from '@/lib/supabase/admin'
import { getOrder } from '@/lib/providers/virtualsms'
import { errorResponse, handleApiError } from '@/lib/validate'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) return errorResponse(500, 'Cron not configured')

  const authHeader = request.headers.get('authorization')
  const provided = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (provided !== cronSecret) return errorResponse(401, 'Unauthorized')

  const admin = createAdminClient()
  const now = new Date().toISOString()
  const results = { swept: 0, errors: 0, verified: 0 }

  try {
    const { data: staleRentals, error: fetchError } = await admin
      .from('rentals')
      .select('id, provider_order_id, provider_name, user_id')
      .eq('status', 'active')
      .lt('expires_at', now)
      .limit(100)

    if (fetchError) throw fetchError

    if (!staleRentals || staleRentals.length === 0) {
      return Response.json({ success: true, message: 'No stale rentals found', ...results })
    }

    for (const rental of staleRentals) {
      try {
        let finalStatus = 'expired'

        if (rental.provider_order_id) {
          try {
            const providerOrder = await getOrder(rental.provider_order_id)
            const s = providerOrder.status as string
            if (s === 'completed' || s === 'received') {
              finalStatus = 'completed'
            } else if (s === 'cancelled' || s === 'canceled') {
              finalStatus = 'cancelled'
            } else {
              finalStatus = 'expired'
            }
            results.verified++
          } catch {
            finalStatus = 'expired'
          }
        }

        const { error: updateError } = await admin
          .from('rentals')
          .update({ status: finalStatus, updated_at: new Date().toISOString() })
          .eq('id', rental.id)
          .eq('status', 'active')

        if (!updateError) {
          results.swept++
        }
      } catch (err) {
        console.error(`[expire-rentals] Failed to sweep rental ${rental.id}:`, err)
        results.errors++
      }
    }

    console.log(`[expire-rentals] Swept ${results.swept} rentals, ${results.errors} errors`)
    return Response.json({ success: true, timestamp: now, ...results })
  } catch (err: unknown) {
    console.error('[expire-rentals] Fatal error:', err)
    return handleApiError(err, 'expire rentals')
  }
}
