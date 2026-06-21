import type { Rental } from './RentalsClient';
import RentalsClient from './RentalsClient';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Rentals - PremiumID',
}

export default async function RentalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let initialRentals: Rental[] = []
  let totalCount = 0

  if (user) {
    const { data: rentals, count } = await supabase
      .from('rentals')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(0, 14)

    initialRentals = rentals?.map(r => {
      const parts = (r.provider_name || '').split('|')
      return {
        ...r,
        service_slug: parts[1] || 'unknown',
        country_code: parts[2] || 'unknown',
      }
    }) || []
    totalCount = count ?? 0
  }

  return (
    <RentalsClient 
      initialRentals={initialRentals} 
      initialTotal={totalCount}
      isLoggedIn={!!user}
    />
  );
}