import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings - PremiumID',
  description: 'Manage your PremiumID account settings.',
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
