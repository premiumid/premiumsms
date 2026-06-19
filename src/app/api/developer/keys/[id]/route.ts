import { authenticateRequest } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { isValidUUID, errorResponse, handleApiError } from '@/lib/validate'

type Params = { params: Promise<{ id: string }> }

export async function DELETE(request: Request, { params }: Params) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const { id } = await params
    if (!isValidUUID(id)) return errorResponse(400, 'Invalid key ID')

    const admin = createAdminClient()
    const { error } = await admin
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id)

    if (error) throw error

    return Response.json({ success: true, message: 'API key revoked successfully' })
  } catch (err: unknown) {
    return handleApiError(err, 'revoke key')
  }
}
