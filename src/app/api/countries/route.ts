import { authenticateRequest } from '@/lib/auth'
import { listCountries } from '@/lib/providers/virtualsms'
import { isValidServiceSlug, errorResponse, handleApiError, cacheControl } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request)
  if (!auth.ok) return auth.response

  try {
    const { searchParams } = new URL(request.url)
    const service = searchParams.get('service')

    if (service && !isValidServiceSlug(service)) {
      return errorResponse(400, 'Invalid service name')
    }

    const result = await listCountries(service ?? undefined)
    return Response.json(
      { countries: result.countries, available: result.available },
      { headers: cacheControl(300) }
    )
  } catch (err) {
    return handleApiError(err, 'countries')
  }
}
