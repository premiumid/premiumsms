'use client'

import { useState } from 'react'
import Link from 'next/link'
import ServiceIcon from '@/components/ServiceIcon'

interface Service {
  slug: string
  name: string
  icon_url?: string
}

export default function DashboardClient({ initialServices, isLoggedIn, activeRentals, balance }: { initialServices: Service[]; isLoggedIn: boolean; activeRentals?: number; balance?: number }) {
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  const filteredApps = initialServices.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeApp = initialServices.find(s => s.slug === selectedApp) || initialServices[0] || null

  return (
    <>
      {isLoggedIn && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/wallet" style={{ flex: 1, minWidth: 160, background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Balance</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>${(balance ?? 0).toFixed(2)}</div>
          </Link>
          <Link href="/dashboard/rentals" style={{ flex: 1, minWidth: 160, background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>Active Rentals</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{activeRentals ?? 0}</div>
          </Link>
          <Link href="/dashboard/numbers" style={{ flex: 1, minWidth: 160, background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1rem', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            Rent a Number
          </Link>
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
            <div
              key={app.slug}
              className={`catalog-sidebar-item ${selectedApp === app.slug ? 'active' : ''}`}
              onClick={() => setSelectedApp(app.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedApp(app.slug) }}
            >
              <div className="catalog-sidebar-item-left">
                <ServiceIcon slug={app.slug} name={app.name} size={24} />
                {app.name}
              </div>
            </div>
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
            <div
              key={app.slug}
              className={`catalog-app-card ${selectedApp === app.slug ? 'active' : ''}`}
              onClick={() => setSelectedApp(app.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedApp(app.slug) }}
            >
              <ServiceIcon slug={app.slug} name={app.name} size={48} />
              <div className="catalog-app-name">{app.name}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--success)' }}>● {initialServices.length} services</span>
          &nbsp; · &nbsp;
          <span style={{ color: 'var(--accent-primary)' }}>● 145+ countries</span>
          &nbsp; · &nbsp;
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
          <div style={{ width: '40px', height: '1px', background: 'var(--border-color)' }}></div>
          <div className="step-indicator-item">
            <div className="step-indicator-num">2</div>
            <div className="step-indicator-text">
              <span>Choose country</span>
              <span>See prices</span>
            </div>
          </div>
          <div style={{ width: '40px', height: '1px', background: 'var(--border-color)' }}></div>
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
        <div style={{ textAlign: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Buy Real SMS Numbers</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Browse live prices, then create a free account when you&apos;re ready to buy.
          </p>
        </div>

        <div className="order-summary-box" style={{ background: 'white', border: 'none', padding: 0 }}>
          <ul className="order-summary-features">
            <li style={{ border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '9999px', justifyContent: 'center' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
              Real SIM Cards
            </li>
            <li style={{ border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '9999px', justifyContent: 'center' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              145+ Countries
            </li>
            <li style={{ border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '9999px', justifyContent: 'center' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Auto-Refund
            </li>
          </ul>

          <Link href={isLoggedIn ? '/dashboard/numbers' : '/register'} className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            {isLoggedIn ? 'Rent a Number →' : 'Create Free Account →'}
          </Link>
          {!isLoggedIn && <>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>No credit card required</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
            </div>
          </>}

          <Link
            href={activeApp ? `/dashboard/numbers?service=${activeApp.slug}` : '/dashboard/numbers'}
            className="btn"
            style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {(activeApp || initialServices[0]) ? (
              <ServiceIcon slug={(activeApp || initialServices[0]).slug} name={(activeApp || initialServices[0]).name} size={20} />
            ) : (
              <span style={{ width: 20, height: 20, borderRadius: 4, background: '#0f172a' }} />
            )}
            Continue with {activeApp ? activeApp.name : 'Telegram'}
          </Link>
        </div>
      </aside>
    </div>
    </>
  )
}
