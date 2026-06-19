import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rent a Number — PremiumID',
  description: 'Browse and rent temporary phone numbers for SMS verification across 2,500+ services.',
}

export default function RentalsLayout({ children }: { children: React.ReactNode }) {
  return children
}
