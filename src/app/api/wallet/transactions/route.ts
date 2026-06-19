import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = new URL(request.url)
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '20')))
  const offset = (page - 1) * limit

  const { data: wallet } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!wallet) {
    return NextResponse.json({ transactions: [], total: 0 })
  }

  const { data: transactions, count: total } = await supabase
    .from('wallet_transactions')
    .select('*', { count: 'exact' })
    .eq('wallet_id', wallet.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  return NextResponse.json({
    transactions: transactions || [],
    total: total ?? 0,
    page,
    limit,
  })
}
