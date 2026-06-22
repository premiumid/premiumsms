import { authenticateRequest } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireEnv, errorResponse, handleApiError } from '@/lib/validate'



export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response
  const NOWPAYMENTS_API_KEY = requireEnv('NOWPAYMENTS_API_KEY')

  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('paymentId')

    if (!paymentId) return errorResponse(400, 'paymentId is required')

    if (!/^\d{1,20}$/.test(paymentId)) {
      return errorResponse(400, 'Invalid payment ID')
    }

    const admin = createAdminClient()
    const { data: record } = await admin
      .from('crypto_payments')
      .select('user_id, amount_usd, processed')
      .eq('nowpayments_id', paymentId)
      .single()

    if (!record || record.user_id !== auth.user.id) {
      return errorResponse(404, 'Payment not found')
    }

    if (record.processed) {
      return Response.json({ status: 'finished', processed: true })
    }

    const npRes = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
      headers: { 'x-api-key': NOWPAYMENTS_API_KEY },
      cache: 'no-store',
    })

    if (!npRes.ok) {
      throw new Error('Failed to fetch status from payment provider')
    }

    const data = await npRes.json()

    const { error: updateError } = await admin
      .from('crypto_payments')
      .update({ status: data.payment_status })
      .eq('nowpayments_id', paymentId)

    if (updateError) {
      console.error('[Status] DB update error:', updateError)
    }

    return Response.json({
      status: data.payment_status,
      actuallyPaid: data.actually_paid,
      payAmount: data.pay_amount,
      payCurrency: data.pay_currency,
      processed: false,
    })
  } catch (err: unknown) {
    console.error('[Status] Error:', err)
    return handleApiError(err, 'payment status')
  }
}
