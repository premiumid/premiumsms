import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteUserAccount, getWalletBalance } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Re-authenticate with password
    const { password } = await request.json()
    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    })

    if (reAuthError) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 403 })
    }

    const userId = user.id

    // Check if user has a positive balance — refund logic would go here in production
    const balance = await getWalletBalance(userId)
    if (balance > 0) {
      return NextResponse.json({
        error: `Your wallet has a balance of $${balance.toFixed(2)}. Please contact support to process a refund before deleting your account.`
      }, { status: 400 })
    }

    await deleteUserAccount(userId)

    // Sign out the user after deletion
    await supabase.auth.signOut()

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Account deletion error:', err)
    return NextResponse.json(
      { error: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    )
  }
}
