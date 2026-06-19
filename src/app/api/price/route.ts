import { authenticateRequest } from '@/lib/auth'
import { getPrice } from '@/lib/providers/virtualsms'
import { isValidServiceSlug, isValidCountryCode, errorResponse, handleApiError, cacheControl } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const country = searchParams.get('country')

  if (!service || !country) {
    return errorResponse(400, 'service and country are required')
  }

  if (!isValidServiceSlug(service)) {
    return errorResponse(400, 'Invalid service name')
  }

  if (!isValidCountryCode(country)) {
    return errorResponse(400, 'Invalid country code')
  }

  try {
    const price = await getPrice(service, country)
    return Response.json({ price }, { headers: cacheControl(30) })
  } catch (err) {
    return handleApiError(err, 'price')
  }
}
