'use client'

import { useState } from 'react'
import Link from 'next/link'
import ServiceIcon from '@/components/ServiceIcon'

interface Service {
  slug: string
  name: string
  icon_url?: string
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

export default function DashboardClient({ initialServices, isLoggedIn, activeRentals, balance, recentTransactions, recentRentals }: { initialServices: Service[]; isLoggedIn: boolean; activeRentals?: number; balance?: number; recentTransactions?: TxRecord[]; recentRentals?: RentalRecord[] }) {
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const filteredApps = initialServices.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeApp = initialServices.find(s => s.slug === selectedApp) || initialServices[0] || null

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="dashboard-layout-wrapper">
      {/* Hero Welcome Bar */}
      {isLoggedIn && (
        <div className="dashboard-hero">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back. Manage your rentals and wallet balance.</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {isLoggedIn && (
        <div className="stat-cards-row">
          <Link href="/dashboard/wallet" className="stat-card-large stat-card-gradient-1">
            <div className="stat-card-header">
              <div className="stat-card-icon icon-green">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <span className="stat-card-title">Balance</span>
            </div>
            <div className="stat-card-value">${(balance ?? 0).toFixed(2)}</div>
            <div className="stat-card-link">Manage Wallet &rarr;</div>
          </Link>

          <Link href="/dashboard/rentals" className="stat-card-large stat-card-gradient-2">
            <div className="stat-card-header">
              <div className="stat-card-icon icon-purple">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <span className="stat-card-title">Active Rentals</span>
            </div>
            <div className="stat-card-value">{activeRentals ?? 0}</div>
            <div className="stat-card-link">View Rentals &rarr;</div>
          </Link>

          <Link href="/dashboard/numbers" className="stat-card-large stat-card-gradient-3">
            <div className="stat-card-header">
              <div className="stat-card-icon icon-amber">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <span className="stat-card-title">New Number</span>
            </div>
            <div className="stat-card-value">Rent</div>
            <div className="stat-card-link">Browse Catalog &rarr;</div>
          </Link>
        </div>
      )}

      {/* Main Catalog 3-Col Layout */}
      <div className="catalog-grid-layout">
        
        {/* Left Sidebar */}
        <aside className="catalog-sidebar">
          <div className="p-4">
            <div className="catalog-search-input-wrap">
              <div className="catalog-search-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="catalog-search-input"
              />
            </div>
          </div>
          <div className="catalog-sidebar-list overflow-y-auto px-2 pb-4">
            {filteredApps.map(app => (
              <Link
                key={app.slug}
                href={isLoggedIn ? `/dashboard/numbers?service=${app.slug}` : '/register'}
                className={`catalog-sidebar-item flex items-center gap-3${selectedApp === app.slug ? ' active' : ''}`}
                onClick={(e) => { if (!isLoggedIn) e.preventDefault(); setSelectedApp(app.slug) }}
              >
                <ServiceIcon slug={app.slug} name={app.name} size={20} />
                <span className="text-sm font-semibold text-primary">{app.name}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main Center Catalog */}
        <main className="catalog-main p-4">
          <div className="catalog-header mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2">Pick a service to get started</h2>
            <p className="text-secondary">Browse {initialServices.length} supported apps across 145+ countries.</p>
          </div>

          <div className="catalog-apps-grid">
            {filteredApps.slice(0, 24).map(app => (
              <Link
                key={app.slug}
                href={isLoggedIn ? `/dashboard/numbers?service=${app.slug}` : '/register'}
                className={`catalog-app-card${selectedApp === app.slug ? ' active' : ''}`}
                onClick={(e) => { if (!isLoggedIn) e.preventDefault(); setSelectedApp(app.slug) }}
              >
                <ServiceIcon slug={app.slug} name={app.name} size={48} />
                <div className="catalog-app-name">{app.name}</div>
              </Link>
            ))}
          </div>
          
          {/* Recent Activity */}
          {isLoggedIn && recentTransactions && recentTransactions.length > 0 && (
            <div className="recent-activity-section">
              <div className="activity-header flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Link href="/dashboard/wallet" className="text-sm font-semibold text-accent no-underline hover:text-white transition-colors">View all</Link>
              </div>
              <div className="glass-panel p-5">
                {recentRentals && recentRentals.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">Rentals</p>
                    {recentRentals.slice(0, 3).map(r => (
                      <Link key={r.id} href={`/dashboard/rentals/${r.id}`} className="flex justify-between items-center p-3 rounded-md hover:bg-white/5 transition-colors no-underline">
                        <span className="flex flex-col gap-1">
                          <span className="font-semibold text-white">{r.phone_number || 'Processing…'}</span>
                          <span className="text-xs text-tertiary">{formatDate(r.created_at)}</span>
                        </span>
                        <span className={`text-sm font-bold ${r.status === 'active' ? 'text-success' : 'text-tertiary'}`}>${Number(r.price).toFixed(2)}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {recentTransactions && recentTransactions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">Transactions</p>
                    {recentTransactions.slice(0, 3).map(tx => (
                      <div key={tx.id} className="flex justify-between items-center p-3 rounded-md">
                        <span className="flex flex-col gap-1">
                          <span className="font-semibold text-white">{tx.description}</span>
                          <span className="text-xs text-tertiary">{formatDate(tx.created_at)}</span>
                        </span>
                        <span className={`text-sm font-bold ${tx.type === 'debit' ? 'text-danger' : 'text-success'}`}>
                          {tx.type === 'debit' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Panel */}
        <aside className="catalog-right p-4 pt-0">
          <div className="catalog-right-hero-dynamic mt-4 sm:mt-0">
            <div className="dynamic-hero-icon">
              {activeApp ? (
                <ServiceIcon slug={activeApp.slug} name={activeApp.name} size={64} />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20">
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
              )}
            </div>
            <h2 className="dynamic-hero-title">{activeApp ? activeApp.name : 'Real SMS Numbers'}</h2>
            <p className="dynamic-hero-price">From $0.05 / SMS</p>
          </div>

          <div className="order-summary-box-redesigned">
            <ul className="flex flex-col gap-4 mb-6">
              <li className="flex items-center gap-3 text-sm text-secondary font-medium">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-success/20 text-success">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                Real SIM Cards
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary font-medium">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                145+ Countries
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary font-medium">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </div>
                Auto-Refund on failure
              </li>
            </ul>

            <Link
              href={isLoggedIn ? (activeApp ? `/dashboard/numbers?service=${activeApp.slug}` : '/dashboard/numbers') : '/register'}
              className="btn btn-primary w-full py-3 shadow-lg shadow-accent/20"
            >
              {isLoggedIn ? (activeApp ? `Rent ${activeApp.name} Number →` : 'Rent a Number →') : 'Create Free Account →'}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
