import crypto from 'crypto'
import { authenticateRequest } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireEnv, errorResponse, handleApiError } from '@/lib/validate'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
const PAY_CURRENCY = 'usdttrc20'

async function getLiveMinimumUsd(apiKey: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.nowpayments.io/v1/min-amount?currency_from=${PAY_CURRENCY}`,
      { headers: { 'x-api-key': apiKey }, cache: 'no-store' }
    )
    if (!res.ok) return 3
    const data = await res.json()
    return Math.ceil((Number(data.min_amount) * 1.1) * 100) / 100
  } catch {
    return 3
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  const NOWPAYMENTS_API_KEY = requireEnv('NOWPAYMENTS_API_KEY')

  try {
    const { amount } = await request.json()
    const amountUsd = Number(amount)

    if (!amountUsd || isNaN(amountUsd) || amountUsd <= 0) {
      return errorResponse(400, 'Invalid amount')
    }

    const minimumUsd = await getLiveMinimumUsd(NOWPAYMENTS_API_KEY)
    if (amountUsd < minimumUsd) {
      return Response.json({
        error: `Minimum top-up amount is $${minimumUsd.toFixed(2)} USD for USDT (TRC-20). Please enter a higher amount.`,
        minimumUsd,
      }, { status: 400 })
    }

    const nonce = crypto.randomUUID().slice(0, 8)
    const orderId = `${auth.user.id}_${amountUsd}_${Date.now()}_${nonce}`

    const npRes = await fetch('https://api.nowpayments.io/v1/payment', {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        price_amount: amountUsd,
        price_currency: 'usd',
        pay_currency: PAY_CURRENCY,
        order_id: orderId,
        order_description: `PremiumID wallet top-up — $${amountUsd} USD`,
        ipn_callback_url: `${APP_URL}/api/webhook/nowpayments`,
      }),
    })

    if (!npRes.ok) {
      const errData = await npRes.json().catch(() => ({}))
      console.error('[NOWPayments] Create payment failed:', errData)
      if (errData.code === 'AMOUNT_MINIMAL_ERROR') {
        return Response.json({
          error: `Amount too low. The minimum for USDT (TRC-20) is approximately $${minimumUsd.toFixed(2)} USD.`,
          minimumUsd,
        }, { status: 400 })
      }
      throw new Error('Payment provider error. Please try again.')
    }

    const payment = await npRes.json()

    const admin = createAdminClient()
    const { error: dbError } = await admin.from('crypto_payments').insert({
      user_id: auth.user.id,
      nowpayments_id: String(payment.payment_id),
      order_id: orderId,
      amount_usd: amountUsd,
      pay_amount: payment.pay_amount,
      pay_currency: payment.pay_currency,
      pay_address: payment.pay_address,
      status: payment.payment_status || 'waiting',
    })

    if (dbError) {
      console.error('[NOWPayments] DB insert error:', dbError)
      return errorResponse(500, 'Failed to create payment. Please try again.')
    }

    return Response.json({
      success: true,
      paymentId: String(payment.payment_id),
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      priceAmount: amountUsd,
      minimumUsd,
    })
  } catch (err: unknown) {
    console.error('[Topup] Error:', err)
    return handleApiError(err, 'topup')
  }
}
