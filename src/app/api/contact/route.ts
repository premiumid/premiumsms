import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || '127.0.0.1'
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)

    // Simple in-memory rate limit: 3 submissions per IP per minute
    const rateLimitKey = `contact:${ip}`
    const now = Date.now()
    const windowMs = 60_000

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: recent, error: recentError } = await supabase
      .from('rate_limit_buckets')
      .select('request_count')
      .eq('key', rateLimitKey)
      .gte('window_start', new Date(now - windowMs).toISOString())
      .single()

    // PGRST116 = no rows found (expected); any other error is a real DB failure
    if (recentError && recentError.code !== 'PGRST116') {
      console.error('[Contact] Rate limit check error:', recentError)
    }

    const count = recent?.request_count ?? 0
    if (count >= 3) {
      return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
    }

    // Record this attempt
    await supabase.from('rate_limit_buckets').upsert(
      { key: rateLimitKey, window_start: new Date(now).toISOString(), request_count: count + 1 },
      { onConflict: 'key,window_start' }
    )

    const { name, email, subject, message } = await request.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 })
    }

    if (name.trim().length > 100 || message.trim().length > 5000) {
      return NextResponse.json({ error: 'Name or message too long.' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { error } = await admin.from('contact_messages').insert({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim() || '',
      message: message.trim(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }
}
