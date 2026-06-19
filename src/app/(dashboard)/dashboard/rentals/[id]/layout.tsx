import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SMS Inbox — PremiumID',
  description: 'View your rented number and received SMS messages.',
}

export default function RentalDetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
