import { createClient } from '@/lib/supabase/server'
import { authenticateRequest } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMessages, cancelOrder, getOrder } from '@/lib/providers/virtualsms'
import { refundWalletBalance } from '@/lib/supabase/admin'
import { isValidUUID, errorResponse, handleApiError } from '@/lib/validate'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    if (!isValidUUID(id)) return errorResponse(400, 'Invalid rental ID')

    const supabase = await createClient()
    const admin = createAdminClient()

    const { data: rental } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    const { data: profile } = await admin
      .from('profiles')
      .select('webhook_url')
      .eq('id', auth.user.id)
      .single()

    if (!rental) return errorResponse(404, 'Rental not found')

    const providerOrder = await getOrder(rental.provider_order_id)
    const newStatus = providerOrder.status

    if (newStatus !== rental.status) {
      await admin
        .from('rentals')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
    }

    const parts = (rental.provider_name || '').split('|')
    const service_slug = parts[1] || 'unknown'
    const country_code = parts[2] || 'unknown'

    const messages = await getMessages(rental.provider_order_id)

    if (messages.length > 0) {
      for (const msg of messages) {
        const { data: existing } = await admin
          .from('sms_messages')
          .select('id')
          .eq('rental_id', id)
          .eq('message_text', msg.text)
          .eq('sender', msg.sender ?? null)
          .maybeSingle()

        if (!existing) {
          const received_at = msg.received_at ?? new Date().toISOString()
          await admin.from('sms_messages').insert({
            rental_id: id,
            sender: msg.sender ?? null,
            message_text: msg.text,
            received_at,
          })

          if (profile?.webhook_url) {
            fetch(profile.webhook_url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'sms.received',
                data: {
                  rental_id: id,
                  service: service_slug,
                  sender: msg.sender ?? null,
                  message: msg.text,
                  received_at
                }
              })
            }).catch(e => console.error('Webhook delivery failed:', e))
          }
        }
      }
    }

    return Response.json({
      messages,
      rental: {
        ...rental,
        status: newStatus,
        service_slug,
        country_code,
      },
    })
  } catch (err) {
    return handleApiError(err, 'rental detail')
  }
}

export async function POST(request: Request, { params }: Params) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    if (!isValidUUID(id)) return errorResponse(400, 'Invalid rental ID')

    const supabase = await createClient()
    const admin = createAdminClient()

    const { data: rental } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .single()

    if (!rental) return errorResponse(404, 'Rental not found')
    if (rental.status !== 'active') {
      return errorResponse(400, 'Only active rentals can be cancelled')
    }

    await cancelOrder(rental.provider_order_id)

    const refundAmount = Number(rental.price ?? 0)
    const parts = (rental.provider_name || '').split('|')
    const service_slug = parts[1] || 'unknown'

    await refundWalletBalance(auth.user.id, refundAmount, `Refund for cancelled ${service_slug} rental`)

    await admin
      .from('rentals')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', id)

    return Response.json({ success: true })
  } catch (err) {
    return handleApiError(err, 'cancel rental')
  }
}
