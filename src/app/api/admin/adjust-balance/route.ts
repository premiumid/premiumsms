import { authenticateRequest } from '@/lib/auth'
import { creditWalletBalance, deductWalletBalance } from '@/lib/supabase/admin'
import { sanitizeReason, isValidUUID, errorResponse, handleApiError } from '@/lib/validate'

export async function POST(request: Request) {
  const auth = await authenticateRequest(request, { requireAdmin: true })
  if (!auth.ok) return auth.response

  try {
    const { targetUserId, amount, action, reason } = await request.json()

    if (!targetUserId || !isValidUUID(targetUserId)) {
      return errorResponse(400, 'Invalid user ID')
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return errorResponse(400, 'Invalid amount')
    }

    if (!action || !['credit', 'debit'].includes(action)) {
      return errorResponse(400, 'Invalid action')
    }

    const desc = sanitizeReason(reason || `Manual adjustment by admin (${auth.user.email})`)

    let newBalance: number
    if (action === 'credit') {
      newBalance = await creditWalletBalance(targetUserId, Number(amount), desc, 'admin_credit')
    } else {
      newBalance = await deductWalletBalance(targetUserId, Number(amount), desc)
    }

    return Response.json({ success: true, newBalance, message: 'Wallet adjusted successfully' })
  } catch (err: unknown) {
    return handleApiError(err, 'adjust balance')
  }
}
