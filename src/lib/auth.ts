import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export type AuthedUser = {
  id: string
  email: string
  role: string
  authMethod: 'session' | 'api_key'
}

type AuthResult =
  | { ok: true; user: AuthedUser }
  | { ok: false; response: NextResponse }

const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 60            // requests per window

/**
 * Check rate limit for a given key (user_id or IP).
 * Uses an INSERT-or-UPSERT pattern via ON CONFLICT for atomic counting.
 */
async function checkRateLimit(key: string): Promise<boolean> {
  const admin = createAdminClient()
  const windowStart = new Date(
    Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS
  ).toISOString()

  // Try to insert a new bucket for this window
  const { error: insertError } = await admin
    .from('rate_limit_buckets')
    .insert({ key, window_start: windowStart, request_count: 1 })

  if (!insertError) {
    // Clean up old windows (fire and forget)
    admin
      .from('rate_limit_buckets')
      .delete()
      .lt('window_start', new Date(Date.now() - RATE_LIMIT_WINDOW_MS * 2).toISOString())
      .then(() => {}, () => {})
    return true
  }

  // Row already exists — read current count using optimistic lock
  for (let attempt = 0; attempt < 3; attempt++) {
    const { data: existing } = await admin
      .from('rate_limit_buckets')
      .select('request_count')
      .eq('key', key)
      .eq('window_start', windowStart)
      .single()

    const currentCount = existing?.request_count ?? 0
    if (currentCount > RATE_LIMIT_MAX) return false

    // Optimistic update — only succeeds if count hasn't changed under us
    const { data: updated } = await admin
      .from('rate_limit_buckets')
      .update({ request_count: currentCount + 1 })
      .eq('key', key)
      .eq('window_start', windowStart)
      .eq('request_count', currentCount)
      .select()

    if (updated && updated.length > 0) return true
  }

  return true
}

/**
 * Authenticate a request via either:
 *  1. Supabase session cookie (browser users)
 *  2. X-API-Key header (developer API)
 *
 * Also checks:
 *  - is_banned on the profile
 *  - rate limit (60 req/min per user)
 */
export async function authenticateRequest(
  request: Request,
  options: { requireAdmin?: boolean } = {}
): Promise<AuthResult> {
  const admin = createAdminClient()

  // --- Try API Key auth first ---
  const apiKeyHeader = request.headers.get('x-api-key')
  if (apiKeyHeader) {
    const keyHash = crypto.createHash('sha256').update(apiKeyHeader).digest('hex')

    const { data: keyRecord } = await admin
      .from('api_keys')
      .select('id, user_id, is_active')
      .eq('key_hash', keyHash)
      .single()

    if (!keyRecord || !keyRecord.is_active) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Invalid or revoked API key' }, { status: 401 }),
      }
    }

    // Update last_used_at asynchronously (fire-and-forget)
    admin
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyRecord.id)
      .then(() => {}, () => {})

    // Fetch the user's profile
    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, role, is_banned')
      .eq('id', keyRecord.user_id)
      .single()

    if (!profile) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'User not found' }, { status: 401 }),
      }
    }

    if (profile.is_banned) {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Account suspended' }, { status: 403 }),
      }
    }

    if (options.requireAdmin && profile.role !== 'admin') {
      return {
        ok: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
      }
    }

    // Rate limit by user_id
    const allowed = await checkRateLimit(`api:${profile.id}`)
    if (!allowed) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Rate limit exceeded. Maximum 60 requests per minute.' },
          {
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Limit': '60',
              'X-RateLimit-Window': '60s',
            },
          }
        ),
      }
    }

    return {
      ok: true,
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        authMethod: 'api_key',
      },
    }
  }

  // --- Fall back to Supabase session ---
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  // Fetch profile for is_banned + role
  const { data: profile } = await admin
    .from('profiles')
    .select('id, email, role, is_banned')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Profile not found' }, { status: 401 }),
    }
  }

  if (profile.is_banned) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Account suspended' }, { status: 403 }),
    }
  }

  if (options.requireAdmin && profile.role !== 'admin') {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    }
  }

  // Rate limit by user_id for session users too
  const allowed = await checkRateLimit(`session:${profile.id}`)
  if (!allowed) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Rate limit exceeded. Maximum 60 requests per minute.' },
        {
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': '60',
            'X-RateLimit-Window': '60s',
          },
        }
      ),
    }
  }

  return {
    ok: true,
    user: {
      id: profile.id,
      email: profile.email ?? user.email ?? '',
      role: profile.role,
      authMethod: 'session',
    },
  }
}
