import { createClient } from '@/lib/supabase/server'
import WalletClient from './WalletClient'
import { provisionUser } from '@/lib/supabase/admin'

export const metadata = {
  title: 'Wallet - PremiumID',
}

export default async function WalletPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // Ensure wallet exists
  await provisionUser(user.id, user.email ?? '')

  // Fetch wallet balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .single()

  const balance = Number(wallet?.balance ?? 0)

  // Fetch transactions
  type TxRow = { id: string; type: 'topup' | 'debit' | 'refund' | 'admin_credit'; amount: number; balance_after: number; description: string; created_at: string }
  let transactions: TxRow[] = []
  if (wallet?.id) {
    const { data: txList } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(20)
    
    transactions = (txList as TxRow[]) || []
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Wallet</h1>
        <p className="page-subtitle">Manage your balance and view transaction history</p>
      </div>
      <WalletClient 
        initialBalance={balance} 
        initialTransactions={transactions} 
        userEmail={user.email ?? ''} 
      />
    </div>
  )
}
