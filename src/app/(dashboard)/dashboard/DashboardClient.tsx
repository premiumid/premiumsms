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
    <>
      {isLoggedIn && (
        <div className="stats-grid">
          <Link href="/dashboard/wallet" className="stats-card">
            <span className="stats-card-label">Balance</span>
            <span className="stats-card-value" style={{ color: 'var(--success)' }}>${(balance ?? 0).toFixed(2)}</span>
          </Link>
          <Link href="/dashboard/rentals" className="stats-card">
            <span className="stats-card-label">Active Rentals</span>
            <span className="stats-card-value" style={{ color: 'var(--accent-primary)' }}>{activeRentals ?? 0}</span>
          </Link>
          <Link href="/dashboard/numbers" className="stats-card stats-card-cta">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Rent a Number
          </Link>
        </div>
      )}
      {isLoggedIn && recentTransactions && recentTransactions.length > 0 && (
        <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
          <div className="activity-header">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Recent Activity</h3>
            <Link href="/dashboard/wallet" style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          <div style={{ padding: '0.5rem 1.25rem' }}>
            {recentRentals && recentRentals.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p className="activity-section-label">Rentals</p>
                {recentRentals.slice(0, 3).map(r => (
                  <Link key={r.id} href={`/dashboard/rentals/${r.id}`} className="activity-row">
                    <span>
                      <span className="activity-row-primary">{r.phone_number || 'Processing…'}</span>
                      <span className="activity-row-date">{formatDate(r.created_at)}</span>
                    </span>
                    <span style={{ fontWeight: 600, color: r.status === 'active' ? 'var(--success)' : 'var(--text-tertiary)', fontSize: '0.875rem' }}>${Number(r.price).toFixed(2)}</span>
                  </Link>
                ))}
              </div>
            )}
            {recentTransactions && recentTransactions.length > 0 && (
              <div>
                <p className="activity-section-label">Transactions</p>
                {recentTransactions.slice(0, 3).map(tx => (
                  <div key={tx.id} className="activity-row">
                    <span>
                      <span className="activity-row-primary">{tx.description}</span>
                      <span className="activity-row-date">{formatDate(tx.created_at)}</span>
                    </span>
                    <span style={{ fontWeight: 600, color: tx.type === 'debit' ? 'var(--danger)' : 'var(--success)', fontSize: '0.875rem' }}>
                      {tx.type === 'debit' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="catalog-grid-layout">
      {/* Left Sidebar */}
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-search">
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="catalog-sidebar-list">
          {filteredApps.map(app => (
            <Link
              key={app.slug}
              href={isLoggedIn ? `/dashboard/numbers?service=${app.slug}` : '/register'}
              className={`catalog-sidebar-item${selectedApp === app.slug ? ' active' : ''}`}
              onClick={(e) => { if (!isLoggedIn) e.preventDefault(); setSelectedApp(app.slug) }}
            >
              <div className="catalog-sidebar-item-left">
                <ServiceIcon slug={app.slug} name={app.name} size={24} />
                {app.name}
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="catalog-main">
        <div className="catalog-header">
          <h1>Pick a service to get started</h1>
          <p>Choose a popular app below, or search the full catalog on the left</p>
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

        <div className="catalog-stats-bar">
          <span style={{ color: 'var(--success)' }}>● {initialServices.length} services</span>
          <span style={{ color: 'var(--accent-primary)' }}>● 145+ countries</span>
          <span style={{ color: 'var(--accent-primary)' }}>● From $0.05</span>
        </div>

        <div className="catalog-step-indicator">
          <div className="step-indicator-item active">
            <div className="step-indicator-num">1</div>
            <div className="step-indicator-text">
              <span>Pick service</span>
              <span>{activeApp?.name || 'From list'}</span>
            </div>
          </div>
          <div className="step-connector" />
          <div className="step-indicator-item">
            <div className="step-indicator-num">2</div>
            <div className="step-indicator-text">
              <span>Choose country</span>
              <span>See prices</span>
            </div>
          </div>
          <div className="step-connector" />
          <div className="step-indicator-item">
            <div className="step-indicator-num">3</div>
            <div className="step-indicator-text">
              <span>Buy number</span>
              <span>Receive SMS</span>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="catalog-right">
        <div className="catalog-right-hero">
          <div className="catalog-right-icon">
            <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h2 className="catalog-right-title">Buy Real SMS Numbers</h2>
          <p className="catalog-right-desc">
            Browse live prices, then create a free account when you&apos;re ready to buy.
          </p>
        </div>

        <div className="order-summary-box">
          <ul className="order-summary-features">
            <li>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Real SIM Cards
            </li>
            <li>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              145+ Countries
            </li>
            <li>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Auto-Refund
            </li>
          </ul>

          <Link href={isLoggedIn ? '/dashboard/numbers' : '/register'} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {isLoggedIn ? 'Rent a Number →' : 'Create Free Account →'}
          </Link>

          {!isLoggedIn && (
            <>
              <p className="catalog-right-note">No credit card required</p>
              <div className="catalog-right-divider">
                <span className="catalog-right-or">OR</span>
              </div>
            </>
          )}

          <Link
            href={activeApp ? `/dashboard/numbers?service=${activeApp.slug}` : '/dashboard/numbers'}
            className="btn catalog-right-cta"
          >
            {(activeApp || initialServices[0]) ? (
              <ServiceIcon slug={(activeApp || initialServices[0]).slug} name={(activeApp || initialServices[0]).name} size={20} />
            ) : (
              <span className="catalog-right-cta-placeholder" />
            )}
            Continue with {activeApp ? activeApp.name : 'Telegram'}
          </Link>
        </div>
      </aside>
    </div>
    </>
  )
}
