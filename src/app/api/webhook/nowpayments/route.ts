import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient, creditWalletBalance } from '@/lib/supabase/admin'
import { requireEnv } from '@/lib/validate'

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
  }
  return sorted
}

function hmacEqual(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'hex')
    const bufB = Buffer.from(b, 'hex')
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch {
    return false
  }
}

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

    // Parse the body inside try/catch so malformed JSON returns 401, not 500
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(rawBody)
    } catch {
      console.error('[Webhook] Malformed JSON body')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // NOWPayments signs the JSON body with keys sorted alphabetically (deep)
    const sorted = sortObjectKeys(parsed) as Record<string, unknown>

    const hmac = crypto.createHmac('sha512', IPN_SECRET)
    hmac.update(JSON.stringify(sorted))
    const calculatedSig = hmac.digest('hex')

    if (!hmacEqual(calculatedSig, signature)) {
      console.error('[Webhook] HMAC signature mismatch')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payment_id = String(parsed.payment_id ?? '')
    const payment_status = String(parsed.payment_status ?? '')
    const actually_paid = Number(parsed.actually_paid ?? 0)
    const pay_amount = Number(parsed.pay_amount ?? 0)
    paymentIdStr = payment_id

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

    // Check if already credited (idempotency guard)
    const refDescription = `Ref: ${paymentIdStr}`
    const { data: existingTx } = await admin
      .from('wallet_transactions')
      .select('id')
      .ilike('description', `%${refDescription}%`)
      .maybeSingle()

    if (existingTx) {
      await admin.from('crypto_payments').update({ status: safeStatus, processed: true }).eq('id', record.id)
      return NextResponse.json({ received: true })
    }

    // Credit the wallet FIRST, then mark as processed.
    // If credit fails, DO NOT mark as processed — webhook retries will recover.
    try {
      await creditWalletBalance(record.user_id, record.amount_usd, `Crypto top-up via USDT (TRC-20) — ${refDescription}`, 'topup')
    } catch (creditErr) {
      console.error('[Webhook] Credit failed — payment NOT marked processed, will retry:', creditErr)
      return NextResponse.json({ received: true })
    }

    // Only mark processed after successful credit
    const { error: markError } = await admin
      .from('crypto_payments')
      .update({ status: safeStatus, processed: true })
      .eq('id', record.id)
      .eq('processed', false)

    if (markError) {
      console.error('[Webhook] Failed to mark as processed (credit was issued):', markError)
    }

    console.log(`[Webhook] ✅ Credited $${record.amount_usd} to user ${record.user_id}`)
    return NextResponse.json({ received: true })

  } catch (err: unknown) {
    console.error(`[Webhook] Error for payment ${paymentIdStr}:`, err)
    return NextResponse.json({ received: true })
  }
}
