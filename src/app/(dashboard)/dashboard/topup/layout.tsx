import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Top Up — PremiumID',
  description: 'Add funds to your wallet using USDT (TRC-20).',
}

export default function TopupLayout({ children }: { children: React.ReactNode }) {
  return children
}
