import DashboardClient from './DashboardClient';
import { listServices, type VsmsService } from '@/lib/providers/virtualsms';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Dashboard - PremiumID',
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

  if (user) {
    const [rentalRes, walletRes] = await Promise.all([
      supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('status', 'active'),
      supabase.from('wallets').select('balance').eq('user_id', user.id).single(),
    ])
    activeRentals = rentalRes.count ?? 0
    balance = Number(walletRes.data?.balance ?? 0)
  }

  return (
    <DashboardClient initialServices={services} isLoggedIn={!!user} activeRentals={activeRentals} balance={balance} />
  );
}