import { authenticateRequest } from '@/lib/auth'
import { errorResponse, handleApiError } from '@/lib/validate'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const { url } = await request.json()
    
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      return errorResponse(400, 'Invalid webhook URL. Must start with http:// or https://')
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from('profiles')
      .update({ webhook_url: url || null })
      .eq('id', auth.user.id)

    if (error) {
      throw error
    }

    return Response.json({ success: true, url: url || null })
  } catch (err) {
    return handleApiError(err, 'update webhook')
  }
}
