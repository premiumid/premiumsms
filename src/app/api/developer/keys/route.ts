import { authenticateRequest } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'
import { sanitizeKeyName, handleApiError } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const admin = createAdminClient()
    const { data: keys, error } = await admin
      .from('api_keys')
      .select('id, name, prefix, is_active, last_used_at, created_at')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json({ keys })
  } catch (err: unknown) {
    return handleApiError(err, 'list keys')
  }
}

export async function POST(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const body = await request.json().catch(() => ({}))
    const name = sanitizeKeyName(body.name || 'Default Key')

    const tokenBytes = crypto.randomBytes(24).toString('hex')
    const rawKey = `pk_live_${tokenBytes}`
    const prefix = `${rawKey.substring(0, 12)}...`

    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex')

    const admin = createAdminClient()
    const { data: keyData, error } = await admin
      .from('api_keys')
      .insert({
        user_id: auth.user.id,
        key_hash: keyHash,
        prefix,
        name,
        is_active: true,
      })
      .select('id, name, prefix, is_active, created_at')
      .single()

    if (error) throw error

    return Response.json(
      {
        key: keyData,
        rawKey,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    return handleApiError(err, 'create key')
  }
}
