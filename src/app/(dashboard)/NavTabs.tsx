'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function TabIcon({ children }: { children: React.ReactNode }) {
  return <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{children}</span>
}

export default function NavTabs() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="app-tabs">
      <Link href="/dashboard" className={`app-tab${isActive('/dashboard') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/dashboard') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </TabIcon>
        Dashboard
      </Link>
      <Link href="/dashboard/rentals" className={`app-tab${isActive('/dashboard/rentals') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/dashboard/rentals') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </TabIcon>
        Rentals
      </Link>
      <Link href="/dashboard/api" className={`app-tab${isActive('/dashboard/api') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/dashboard/api') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </TabIcon>
        API
      </Link>
      <Link href="/pricing" className={`app-tab${isActive('/pricing') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/pricing') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </TabIcon>
        Pricing
      </Link>
      <Link href="/faq" className={`app-tab${isActive('/faq') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/faq') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </TabIcon>
        FAQ
      </Link>
      <Link href="/dashboard/settings" className={`app-tab${isActive('/dashboard/settings') ? ' active' : ''}`}>
        <TabIcon>
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isActive('/dashboard/settings') ? 'var(--accent-primary)' : 'var(--text-tertiary)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </TabIcon>
        Settings
      </Link>
    </div>
  )
}
