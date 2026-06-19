import { authenticateRequest } from '@/lib/auth'
import { getBalance } from '@/lib/providers/virtualsms'
import { createAdminClient } from '@/lib/supabase/admin'
import { handleApiError } from '@/lib/validate'

export async function GET(request: Request) {
  const auth = await authenticateRequest(request, { requireAdmin: true })
  if (!auth.ok) return auth.response

  try {
    const admin = createAdminClient()

    const dbStart = Date.now()
    const { error: dbError } = await admin
      .from('profiles')
      .select('count', { count: 'exact', head: true })
    const dbLatency = Date.now() - dbStart
    const dbHealthy = !dbError

    let providerLatency = 0
    let providerHealthy = false
    let providerBalance = 0
    let providerErrorMsg = null

    try {
      const providerStart = Date.now()
      providerBalance = await getBalance()
      providerLatency = Date.now() - providerStart
      providerHealthy = true
    } catch (err: unknown) {
      providerErrorMsg = err instanceof Error ? err.message : 'Upstream provider connection error'
    }

    const { data: rentalsBreakdown } = await admin
      .from('rentals')
      .select('status')

    const stats = { active: 0, completed: 0, cancelled: 0, expired: 0, total: 0 }

    if (rentalsBreakdown) {
      stats.total = rentalsBreakdown.length
      rentalsBreakdown.forEach((r: { status: string }) => {
        if (r.status === 'active') stats.active++
        else if (r.status === 'completed') stats.completed++
        else if (r.status === 'cancelled' || r.status === 'canceled') stats.cancelled++
        else if (r.status === 'expired') stats.expired++
      })
    }

    return Response.json({
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        healthy: dbHealthy,
        latencyMs: dbLatency,
        error: dbError ? dbError.message : null,
      },
      provider: {
        healthy: providerHealthy,
        latencyMs: providerLatency,
        balance: providerBalance,
        error: providerErrorMsg,
      },
      stats,
    })
  } catch (err: unknown) {
    return handleApiError(err, 'health check')
  }
}
