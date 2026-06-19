import DashboardClient from './DashboardClient';
import { listServices, type VsmsService } from '@/lib/providers/virtualsms';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Dashboard - PremiumID',
}

interface TxRecord {
  id: string
  type: string
  amount: number
  description: string
  created_at: string
}

interface RentalRecord {
  id: string
  phone_number: string
  status: string
  price: number
  provider_name: string
  created_at: string
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let services: VsmsService[] = [];
  try {
    services = await listServices();
  } catch (error) {
    console.error("Failed to load services", error);
  }

  let activeRentals = 0
  let balance = 0
  let recentTransactions: TxRecord[] = []
  let recentRentals: RentalRecord[] = []

  if (user) {
    const [rentalRes, walletRes, txRes, rentalsRes] = await Promise.all([
      supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
      supabase.from('wallets').select('balance').eq('user_id', user.id).single(),
      supabase.from('wallet_transactions')
        .select('id, type, amount, description, created_at')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('rentals')
        .select('id, phone_number, status, price, provider_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
    ])
    activeRentals = rentalRes.count ?? 0
    balance = Number(walletRes.data?.balance ?? 0)
    recentTransactions = (txRes.data as TxRecord[]) || []
    recentRentals = (rentalsRes.data as RentalRecord[]) || []
  }

  return (
    <DashboardClient 
      initialServices={services} 
      isLoggedIn={!!user} 
      activeRentals={activeRentals} 
      balance={balance}
      recentTransactions={recentTransactions}
      recentRentals={recentRentals}
    />
  );
}