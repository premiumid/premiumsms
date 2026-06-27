'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ServiceIcon from '@/components/ServiceIcon'

interface Service {
  slug: string
  name: string
  icon_url?: string
}

interface Country {
  code: string
  name: string
  flag?: string
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

const POPULAR_SERVICES: Service[] = [
  { slug: 'telegram', name: 'Telegram' },
  { slug: 'whatsapp', name: 'WhatsApp' },
  { slug: 'instagram', name: 'Instagram' },
  { slug: 'facebook', name: 'Facebook' },
  { slug: 'tiktok', name: 'TikTok' },
  { slug: 'google', name: 'Google' },
  { slug: 'twitter', name: 'Twitter' },
  { slug: 'discord', name: 'Discord' },
  { slug: 'microsoft', name: 'Microsoft' },
  { slug: 'amazon', name: 'Amazon' },
  { slug: 'netflix', name: 'Netflix' },
  { slug: 'spotify', name: 'Spotify' },
  { slug: 'uber', name: 'Uber' },
  { slug: 'paypal', name: 'PayPal' },
  { slug: 'linkedin', name: 'LinkedIn' },
  { slug: 'snapchat', name: 'Snapchat' },
  { slug: 'twitch', name: 'Twitch' },
  { slug: 'steam', name: 'Steam' },
]

export default function DashboardClient({
  initialServices,
  isLoggedIn,
  recentTransactions,
  recentRentals,
  servicesError,
}: {
  initialServices: Service[]
  isLoggedIn: boolean
  recentTransactions?: TxRecord[]
  recentRentals?: RentalRecord[]
  servicesError?: boolean
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const sortedServices = [...initialServices].sort((a, b) => {
    const aIndex = POPULAR_SERVICES.findIndex(
      p => p.slug.toLowerCase() === a.slug.toLowerCase() || p.name.toLowerCase() === a.name.toLowerCase()
    )
    const bIndex = POPULAR_SERVICES.findIndex(
      p => p.slug.toLowerCase() === b.slug.toLowerCase() || p.name.toLowerCase() === b.name.toLowerCase()
    )
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.name.localeCompare(b.name)
  })

  const filteredApps = sortedServices.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  const popularApps = POPULAR_SERVICES.map(p => {
    const found = initialServices.find(
      s => s.slug.toLowerCase() === p.slug.toLowerCase() || s.name.toLowerCase() === p.name.toLowerCase()
    )
    return found || p
  })

  const activeApp =
    selectedApp
      ? initialServices.find(s => s.slug.toLowerCase() === selectedApp.toLowerCase()) ||
        POPULAR_SERVICES.find(s => s.slug === selectedApp) ||
        null
      : null

  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [price, setPrice] = useState<number | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [renting, setRenting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  )
  const activeCountry = countries.find(c => c.code === selectedCountry)
  const activeAppSlug = activeApp?.slug

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!activeAppSlug) return
    setCountriesLoading(true)
    setCountries([])
    setSelectedCountry('')
    setPrice(null)
    setError(null)
    setIsDropdownOpen(false)
    setCountrySearch('')

    fetch(`/api/countries?service=${activeAppSlug}`)
      .then(r => r.json())
      .then(d => setCountries(d.countries || []))
      .catch(() => setError('Failed to load countries'))
      .finally(() => setCountriesLoading(false))
  }, [activeAppSlug])

  useEffect(() => {
    if (!activeAppSlug || !selectedCountry) { setPrice(null); return }
    setPriceLoading(true)
    setPrice(null)
    setError(null)

    fetch(`/api/price?service=${activeAppSlug}&country=${selectedCountry}`)
      .then(r => r.json())
      .then(d => setPrice(d.price?.price_usd ?? null))
      .catch(() => setError('Failed to load price'))
      .finally(() => setPriceLoading(false))
  }, [activeAppSlug, selectedCountry])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Lock body scroll on mobile when sheet is open
  useEffect(() => {
    if (sheetOpen && typeof window !== 'undefined' && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sheetOpen])

  const sheetRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (sheetOpen) sheetRef.current?.focus()
  }, [sheetOpen])

  function openSheet(slug: string) {
    setSelectedApp(slug)
    setSheetOpen(true)
  }

  function closeSheet() {
    setSheetOpen(false)
  }

  async function handleRent() {
    if (!activeApp || !selectedCountry || !isLoggedIn) return
    setRenting(true)
    setError(null)
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: activeApp.slug, country: selectedCountry }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to rent number')
      router.push(`/dashboard/rentals/${data.rental.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setRenting(false)
    }
  }

  const formatDate = (d: string) => {
    const date = new Date(d)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const isCtaReady = !!selectedCountry && price !== null && !priceLoading && !renting

  /* Shared country dropdown */
  function CountryDropdown() {
    return countriesLoading ? (
      <div className="text-sm text-secondary animate-pulse py-2">Loading countries…</div>
    ) : (
      <div className="premium-dropdown-container">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="premium-dropdown-trigger"
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen ? 'true' : 'false'}
          aria-label={activeCountry ? `Selected: ${activeCountry.name}` : 'Choose a country'}
        >
          <span className="premium-dropdown-trigger-content">
            {activeCountry ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://flagcdn.com/16x12/${activeCountry.code.toLowerCase()}.png`}
                  alt=""
                  className="country-flag-icon"
                />
                {activeCountry.name}
              </>
            ) : (
              <span className="text-secondary">-- Choose a country --</span>
            )}
          </span>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isDropdownOpen && (
          <>
            <div className="premium-dropdown-overlay" onClick={() => setIsDropdownOpen(false)} />
            <div className="premium-dropdown-menu">
              <div className="premium-dropdown-search-wrap">
                <div className="premium-dropdown-search-icon">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={countrySearch}
                  onChange={e => setCountrySearch(e.target.value)}
                  className="premium-dropdown-search-input"
                  autoFocus
                  aria-label="Search countries"
                />
              </div>
              <div className="premium-dropdown-list" role="listbox" aria-label="Select a country">
                {filteredCountries.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    role="option"
                    aria-selected={selectedCountry === c.code ? 'true' : 'false'}
                    onClick={() => { setSelectedCountry(c.code); setIsDropdownOpen(false); setCountrySearch('') }}
                    className={`premium-dropdown-item${selectedCountry === c.code ? ' active' : ''}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://flagcdn.com/16x12/${c.code.toLowerCase()}.png`} alt="" className="country-flag-icon" />
                    <span>{c.name}</span>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="premium-dropdown-empty">No countries found</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  /* Shared rent / login CTA */
  function OrderCTA({ pulse = false }: { pulse?: boolean }) {
    if (!activeApp) return null
    if (isLoggedIn) {
      return (
        <button
          type="button"
          onClick={handleRent}
          disabled={renting || !selectedCountry || price === null}
          className={`btn btn-primary w-full py-3 flex items-center justify-center gap-2${pulse && isCtaReady ? ' btn-ready-pulse' : ''}`}
          id="dashboard-checkout-btn"
        >
          {renting ? (
            <><span className="spinner-sm animate-spin" /> Renting…</>
          ) : (
            <>Get My Number &rarr;</>
          )}
        </button>
      )
    }
    return (
      <Link
        href="/register"
        className="btn btn-primary w-full py-3 block text-center"
      >
        Create Free Account &rarr;
      </Link>
    )
  }

  /* 3-step progress indicator */
  function StepBar() {
    const s1 = !!selectedApp
    const s2 = !!selectedCountry
    const s3 = s2 && price !== null && !priceLoading
    return (
      <div className="step-bar">
        <div className={`step-item${s1 ? ' done' : ' active'}`}>
          <div className="step-dot">{s1 ? '✓' : '1'}</div>
          <span className="step-label">Service</span>
        </div>
        <div className={`step-line${s1 ? ' filled' : ''}`} />
        <div className={`step-item${s2 ? ' done' : s1 ? ' active' : ''}`}>
          <div className="step-dot">{s2 ? '✓' : '2'}</div>
          <span className="step-label">Country</span>
        </div>
        <div className={`step-line${s2 ? ' filled' : ''}`} />
        <div className={`step-item${s3 ? ' active' : ''}`}>
          <div className="step-dot">{s3 ? '→' : '3'}</div>
          <span className="step-label">Confirm</span>
        </div>
      </div>
    )
  }

  const displayApps = search
    ? (filteredApps.length > 0 ? filteredApps.slice(0, 24) : [])
    : popularApps

  return (
    <div className="dashboard-layout-wrapper">

      {/* Hero bar */}
      {isLoggedIn && (
        <div className="dashboard-hero">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back. Manage your rentals and wallet balance.</p>
          </div>
        </div>
      )}

      {/* Guest welcome banner */}
      {!isLoggedIn && (
        <div className="guest-welcome-banner">
          <div>
            <h1>Get Virtual Phone Numbers Instantly</h1>
            <p>Browse 2500+ services. Pick a number, receive your SMS, and verify your account in seconds.</p>
          </div>
          <Link href="/register" className="btn btn-primary">Get Started Free &rarr;</Link>
        </div>
      )}

      {/* 3-col catalog */}
      <div className="catalog-grid-layout">

        {/* Left sidebar — desktop only */}
        <aside className="catalog-sidebar">
          <div className="p-4">
            <label htmlFor="catalog-search-input" className="sr-only">Search services</label>
            <div className="catalog-search-input-wrap">
              <div className="catalog-search-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                id="catalog-search-input"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="catalog-search-input"
              />
            </div>
          </div>
          <div className="catalog-sidebar-list overflow-y-auto px-2 pb-4">
            {filteredApps.map(app => (
              <button
                key={app.slug}
                type="button"
                className={`catalog-sidebar-item flex items-center gap-3 w-full text-left${selectedApp === app.slug ? ' active' : ''}`}
                onClick={() => openSheet(app.slug)}
              >
                <ServiceIcon slug={app.slug} name={app.name} iconUrl={app.icon_url} size={24} iconSize={14} />
                <span className="text-sm font-semibold text-primary">{app.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Center catalog */}
        <main className="catalog-main p-4">

          {/* Mobile search strip */}
          <div className="mobile-search-strip">
            <label htmlFor="mobile-catalog-search" className="sr-only">Search services</label>
            <div className="catalog-search-input-wrap mobile-search-input-wrap">
              <div className="catalog-search-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                id="mobile-catalog-search"
                placeholder="Search 2500+ services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="catalog-search-input"
              />
            </div>
          </div>

          {/* Catalog heading */}
          <div className="catalog-header mb-6 text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-1">
              {search ? `Results for "${search}"` : 'Pick a service'}
            </h2>
            <p className="text-secondary text-sm">
              {search
                ? `${filteredApps.length} service${filteredApps.length === 1 ? '' : 's'} found`
                : '18 popular · 2500+ total · tap to order'}
            </p>
          </div>

          {/* Service card grid */}
          <div className="catalog-apps-grid">
            {servicesError ? (
              <div className="catalog-error-state">
                Services are temporarily unavailable. Please try again later.
              </div>
            ) : search && filteredApps.length === 0 ? (
              <div className="catalog-empty-state">
                <p>No services found for &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              displayApps.map(app => (
                <button
                  key={app.slug}
                  type="button"
                  aria-label={`Order ${app.name}`}
                  className={`catalog-app-card w-full text-left${selectedApp === app.slug ? ' active' : ''}`}
                  onClick={() => openSheet(app.slug)}
                >
                  <ServiceIcon slug={app.slug} name={app.name} iconUrl={app.icon_url} size={56} />
                  <div className="catalog-app-name">{app.name}</div>
                </button>
              ))
            )}
          </div>

          {/* Stats bar */}
          {!search && (
            <div className="catalog-stats-bar mt-6 flex justify-center gap-6 text-sm text-secondary font-medium">
              <span className="flex items-center gap-1.5"><span className="stat-dot stat-dot--success"></span> 2500+ services</span>
              <span className="flex items-center gap-1.5"><span className="stat-dot stat-dot--accent"></span> 145+ countries</span>
              <span className="flex items-center gap-1.5"><span className="stat-dot stat-dot--muted"></span> From $0.05</span>
            </div>
          )}

          {/* Recent Activity */}
          {isLoggedIn && recentTransactions && recentTransactions.length > 0 && (
            <div className="recent-activity-section">
              <div className="activity-header flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Link href="/dashboard/wallet" className="text-sm font-semibold text-accent no-underline hover-link transition-colors">View all</Link>
              </div>
              <div className="glass-panel p-5">
                {recentRentals && recentRentals.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-tertiary uppercase tracking-wider mb-3">Rentals</p>
                    {recentRentals.slice(0, 3).map(r => (
                      <Link key={r.id} href={`/dashboard/rentals/${r.id}`} className="flex justify-between items-center p-3 rounded-md hover-bg-muted transition-colors no-underline">
                        <span className="flex flex-col gap-1">
                          <span className="font-semibold">{r.phone_number || 'Processing…'}</span>
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
                          <span className="font-semibold">{tx.description}</span>
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

        {/* Right panel — tablet + desktop */}
        <aside className="catalog-right p-4 pt-0">

          {/* Step bar */}
          <StepBar />

          <div className="catalog-right-hero-dynamic">
            <div className="dynamic-hero-icon">
              {activeApp ? (
                <ServiceIcon slug={activeApp.slug} name={activeApp.name} iconUrl={activeApp.icon_url} size={64} />
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20">
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </div>
              )}
            </div>
            <h2 className="dynamic-hero-title">{activeApp ? activeApp.name : 'Real SMS Numbers'}</h2>
            <p className="dynamic-hero-price">
              {priceLoading
                ? 'Fetching price…'
                : price !== null
                  ? `$${price.toFixed(2)}`
                  : activeApp
                    ? 'Select a country'
                    : 'Instant Activation'}
            </p>
          </div>

          <div className="order-summary-box">
            {activeApp ? (
              <div className="mb-6">
                <label className="block text-xs font-bold text-tertiary uppercase tracking-wider mb-2">
                  Select Country
                </label>
                <CountryDropdown />
              </div>
            ) : (
              <p className="text-sm text-secondary mb-6 text-center">
                Select a service from the grid to get started.
              </p>
            )}

            {error && (
              <div className="text-xs text-danger mb-4 bg-danger/10 p-2.5 rounded-lg border border-danger/20">
                {error}
              </div>
            )}

            <ul className="order-summary-features">
              <li>Real SIM Cards</li>
              <li>145+ Countries</li>
              <li>Auto-Refund on failure</li>
            </ul>

            {activeApp ? (
              <>
                <OrderCTA pulse />
                <p className="catalog-price-footnote">One-time charge. Auto-refund if no SMS received.</p>
              </>
            ) : (
              <button type="button" disabled className="catalog-right-cta opacity-50 cursor-not-allowed">
                Select a Service
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* ── Mobile Bottom Sheet ── */}
      {sheetOpen && activeApp && (
        <>
          <div
            className="order-sheet-backdrop"
            onClick={closeSheet}
            aria-hidden="true"
          />
          <div
            className="order-sheet"
            ref={sheetRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${activeApp.name}`}
          >
            {/* Drag handle / tap-to-close */}
            <div
              className="order-sheet-handle-wrap"
              onClick={closeSheet}
              role="button"
              aria-label="Close"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && closeSheet()}
            >
              <div className="order-sheet-handle" aria-hidden="true" />
            </div>

            {/* Service header */}
            <div className="order-sheet-header">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <ServiceIcon slug={activeApp.slug} name={activeApp.name} iconUrl={activeApp.icon_url} size={44} />
                <div className="min-w-0">
                  <div className="order-sheet-service-name">{activeApp.name}</div>
                  <div className="order-sheet-price">
                    {priceLoading ? (
                      <span className="animate-pulse text-secondary">Loading…</span>
                    ) : price !== null ? (
                      <span className="text-success font-bold">${price.toFixed(2)}</span>
                    ) : (
                      <span className="text-tertiary">Choose a country</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="order-sheet-step-badge">
                  {!selectedCountry ? 'Step 2' : price !== null ? 'Step 3' : 'Step 2'}
                </span>
                <button
                  type="button"
                  className="mobile-order-panel-close"
                  onClick={closeSheet}
                  aria-label="Close order panel"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="order-sheet-body">
              <CountryDropdown />

              {error && (
                <div className="text-xs text-danger mt-3 bg-danger/10 p-2.5 rounded-lg border border-danger/20">
                  {error}
                </div>
              )}

              <div className="mt-3">
                <OrderCTA pulse />
                <p className="catalog-price-footnote">One-time charge. Auto-refund if no SMS received.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
