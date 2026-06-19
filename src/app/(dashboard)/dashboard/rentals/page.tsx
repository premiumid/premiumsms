import RentalsClient from './RentalsClient';
import { listCountries, listServices, type VsmsCountry, type VsmsService } from '@/lib/providers/virtualsms';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Rentals - PremiumID',
}

export default async function RentalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let countries: VsmsCountry[] = [];
  let services: VsmsService[] = [];
  try {
    const [c, s] = await Promise.all([
      listCountries(),
      listServices()
    ]);
    countries = c;
    services = s;
  } catch (error) {
    console.error("Failed to load initial data", error);
  }

  return (
    <RentalsClient 
      initialCountries={countries} 
      initialServices={services} 
      isLoggedIn={!!user}
    />
  );
}