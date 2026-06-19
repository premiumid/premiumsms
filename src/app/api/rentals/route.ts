import { createClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { createOrder, getPrice, cancelOrder } from '@/lib/providers/virtualsms'
import { provisionUser, deductWalletBalance } from '@/lib/supabase/admin'
import { isValidServiceSlug, isValidCountryCode, errorResponse, handleApiError } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const supabase = await createClient()

    const { data: rentals } = await supabase
      .from('rentals')
      .select('*')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    const mappedRentals = rentals?.map(r => {
      const parts = (r.provider_name || '').split('|')
      return {
        ...r,
        service_slug: parts[1] || 'unknown',
        country_code: parts[2] || 'unknown',
      }
    })

    return Response.json({ rentals: mappedRentals })
  } catch (err) {
    return handleApiError(err, 'list rentals')
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const supabase = await createClient()
    const { service, country } = await request.json()

    if (!service || !country) {
      return errorResponse(400, 'service and country are required')
    }

    if (!isValidServiceSlug(service)) {
      return errorResponse(400, 'Invalid service name')
    }

    if (!isValidCountryCode(country)) {
      return errorResponse(400, 'Invalid country code')
    }

    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', auth.user.id)
      .single()

    const balance = Number(wallet?.balance ?? 0)

    const priceData = await getPrice(service, country)
    const price = priceData.price_usd

    if (!priceData.available) {
      return errorResponse(400, 'Number currently unavailable for this service/country')
    }

    if (balance < price) {
      return errorResponse(402, `Insufficient balance. Required: $${price.toFixed(2)}, Available: $${balance.toFixed(2)}`)
    }

    await provisionUser(auth.user.id, auth.user.email)

    const order = await createOrder(service, country)

    try {
      await deductWalletBalance(auth.user.id, price, `Rented ${service} number (${country})`)
    } catch (err: unknown) {
      try {
        await cancelOrder(order.id)
      } catch {
        // Rollback failed — order may be orphaned
      }
      const msg = err instanceof Error ? err.message : 'Deduction failed'
      return errorResponse(402, msg)
    }

    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .insert({
        user_id: auth.user.id,
        provider_name: `virtualsms|${service}|${country}`,
        provider_order_id: order.id,
        phone_number: order.phone,
        price: price,
        status: 'active',
        expires_at: order.expires_at,
      })
      .select()
      .single()

    if (rentalError) throw rentalError

    return Response.json({ rental }, { status: 201 })
  } catch (err) {
    return handleApiError(err, 'create rental')
  }
}
