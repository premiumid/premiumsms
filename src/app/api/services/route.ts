import { authenticateRequest } from '@/lib/auth'
import { listServices } from '@/lib/providers/virtualsms'
import { handleApiError, cacheControl } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const services = await listServices()
    return Response.json({ services }, { headers: cacheControl(300) })
  } catch (err) {
    return handleApiError(err, 'services')
  }
}
