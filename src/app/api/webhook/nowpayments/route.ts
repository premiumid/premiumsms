import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient, creditWalletBalance } from '@/lib/supabase/admin'
import { requireEnv } from '@/lib/validate'



const VALID_STATUSES = new Set(['waiting', 'confirming', 'confirmed', 'sending', 'partially_paid', 'finished', 'failed', 'refunded', 'expired'])

// Disable body parsing — we need the raw text for HMAC verification
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  let paymentIdStr = 'unknown'
  const IPN_SECRET = requireEnv('NOWPAYMENTS_IPN_SECRET')

  try {
    const rawBody = await request.text()
    const signature = request.headers.get('x-nowpayments-sig')

    if (!signature || !IPN_SECRET) {
      console.error('[Webhook] Missing signature or IPN secret')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // NOWPayments signs the JSON body with keys sorted alphabetically
    const parsed = JSON.parse(rawBody)
    const sorted = Object.keys(parsed)
      .sort()
      .reduce((acc: Record<string, unknown>, key) => {
        acc[key] = parsed[key]
        return acc
      }, {})

    const hmac = crypto.createHmac('sha512', IPN_SECRET)
    hmac.update(JSON.stringify(sorted))
    const calculatedSig = hmac.digest('hex')

    if (calculatedSig !== signature) {
      console.error('[Webhook] HMAC signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const { payment_id, payment_status, actually_paid, pay_amount } = parsed
    paymentIdStr = String(payment_id)

    const safeStatus = VALID_STATUSES.has(payment_status) ? payment_status : 'waiting'

    console.log(`[Webhook] Payment ${paymentIdStr}: ${safeStatus}`)

    const admin = createAdminClient()

    // Update status in DB regardless of completion
    await admin
      .from('crypto_payments')
      .update({ status: safeStatus })
      .eq('nowpayments_id', paymentIdStr)

    // Determine if payment is complete enough to credit
    const isComplete =
      safeStatus === 'finished' ||
      safeStatus === 'confirmed' ||
      (safeStatus === 'partially_paid' &&
        Number(actually_paid) >= Number(pay_amount) * 0.95)

    if (!isComplete) {
      return NextResponse.json({ received: true })
    }

    // Look up the payment record
    const { data: record } = await admin
      .from('crypto_payments')
      .select('id, user_id, amount_usd, processed')
      .eq('nowpayments_id', paymentIdStr)
      .single()

    if (!record) {
      console.error('[Webhook] Payment not found in DB:', paymentIdStr)
      return NextResponse.json({ received: true })
    }

    if (record.processed) {
      console.log('[Webhook] Already processed (idempotency guard):', paymentIdStr)
      return NextResponse.json({ received: true })
    }

    // Atomically mark as processed BEFORE crediting — prevents double-credit on retries
    const { error: updateError } = await admin
      .from('crypto_payments')
      .update({ status: safeStatus, processed: true })
      .eq('id', record.id)
      .eq('processed', false) // Only succeeds if not already processed

    if (updateError) {
      console.error('[Webhook] Failed to mark as processed:', updateError)
      return NextResponse.json({ received: true })
    }

    // Credit the user's wallet
    const description = `Crypto top-up via USDT (TRC-20) — Ref: ${paymentIdStr}`
    await creditWalletBalance(record.user_id, record.amount_usd, description, 'topup')

    console.log(`[Webhook] ✅ Credited $${record.amount_usd} to user ${record.user_id}`)
    return NextResponse.json({ received: true })

  } catch (err: unknown) {
    console.error(`[Webhook] Error for payment ${paymentIdStr}:`, err)
    // Always return 200 so NOWPayments does not retry endlessly
    return NextResponse.json({ received: true })
  }
}
