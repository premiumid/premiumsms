import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getBalance } from '@/lib/providers/virtualsms'
import AdminClient from './AdminClient'

export const metadata = {
  title: 'Admin Dashboard - PremiumID',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Double check admin status via profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Use admin client to query all system details bypass RLS
  const admin = createAdminClient()

  // Fetch all profiles joined with their wallets
  const { data: usersData, error: usersError } = await admin
    .from('profiles')
    .select('id, email, role, wallets(balance), created_at')
    .order('created_at', { ascending: false })

  if (usersError) {
    console.error('Admin users load error:', usersError)
  }

  // Fetch rentals with profiles
  const { data: rentalsData, error: rentalsError } = await admin
    .from('rentals')
    .select('id, phone_number, status, price, created_at, provider_name, profiles(email)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (rentalsError) {
    console.error('Admin rentals load error:', rentalsError)
  }

  // Fetch debit transactions to aggregate total system revenue
  const { data: debitTransactions } = await admin
    .from('wallet_transactions')
    .select('amount')
    .eq('type', 'debit')

  const totalRevenue = (debitTransactions || []).reduce((sum, tx) => sum + Number(tx.amount), 0)

  // Fetch total rentals count
  const { count: rentalsCount } = await admin
    .from('rentals')
    .select('*', { count: 'exact', head: true })

  // Fetch provider balance from VirtualSMS
  let providerBalance = 0
  try {
    providerBalance = await getBalance()
  } catch (err) {
    console.error('Failed to load VirtualSMS balance:', err)
  }

  // Calculate daily analytics trends (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const registrationsTrend = last7Days.map(date => {
    const count = (usersData || []).filter(u => u.created_at?.startsWith(date)).length
    return { date, count }
  })

  // Fetch top-up transactions
  const { data: topupTransactions } = await admin
    .from('wallet_transactions')
    .select('amount, created_at')
    .eq('type', 'topup')

  const topupsTrend = last7Days.map(date => {
    const sum = (topupTransactions || [])
      .filter(t => t.created_at?.startsWith(date))
      .reduce((s, t) => s + Number(t.amount), 0)
    return { date, amount: sum }
  })

  const rentalsTrend = last7Days.map(date => {
    const count = (rentalsData || []).filter(r => r.created_at?.startsWith(date)).length
    return { date, count }
  })

  type UserRow = {
    id: string; email: string; role: string; created_at: string
    wallets: { balance: number } | { balance: number }[] | null
  }
  const mappedUsers = (usersData || []).map((u: UserRow) => {
    let balance = 0
    if (u.wallets) {
      balance = Array.isArray(u.wallets) 
        ? Number(u.wallets[0]?.balance ?? 0) 
        : Number(u.wallets.balance ?? 0)
    }
    return {
      id: u.id,
      email: u.email,
      role: (u.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
      balance,
      created_at: u.created_at
    }
  })

  type RentalRow = {
    id: string; phone_number: string; status: string; price: number
    created_at: string; provider_name: string
    profiles: { email: string } | { email: string }[] | null
  }
  const mappedRentals = (rentalsData || []).map((r: RentalRow) => ({
    id: r.id,
    phone_number: r.phone_number || 'No number',
    status: r.status || 'pending',
    price: Number(r.price ?? 0),
    created_at: r.created_at,
    provider_name: r.provider_name || '',
    user_email: Array.isArray(r.profiles) ? (r.profiles[0]?.email || 'Unknown') : (r.profiles?.email || 'Unknown User')
  }))

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Oversee operations, manage balances, and monitor service activity</p>
      </div>

      <AdminClient
        initialUsers={mappedUsers}
        initialRentals={mappedRentals}
        totalRevenue={totalRevenue}
        providerBalance={providerBalance}
        totalRentalsCount={rentalsCount || 0}
        registrationsTrend={registrationsTrend}
        topupsTrend={topupsTrend}
        rentalsTrend={rentalsTrend}
      />
    </div>
  )
}
