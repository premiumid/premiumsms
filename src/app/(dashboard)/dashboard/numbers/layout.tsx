import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rent a Number — PremiumID',
  description: 'Browse services and countries to rent a real SIM number for SMS verification.',
}

export default function NumbersLayout({ children }: { children: React.ReactNode }) {
  return children
}
