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
  { slug: 'tg',  name: 'Telegram' },
  { slug: 'wa',  name: 'WhatsApp' },
  { slug: 'ig',  name: 'Instagram' },
  { slug: 'fb',  name: 'Facebook' },
  { slug: 'lf',  name: 'TikTok' },
  { slug: 'go',  name: 'Google' },
  { slug: 'tw',  name: 'Twitter' },
  { slug: 'ds',  name: 'Discord' },
  { slug: 'mm',  name: 'Microsoft' },
  { slug: 'am',  name: 'Amazon' },
  { slug: 'nf',  name: 'Netflix' },
  { slug: 'alj', name: 'Spotify' },
  { slug: 'ub',  name: 'Uber' },
  { slug: 'ts',  name: 'PayPal' },
  { slug: 'tn',  name: 'LinkedIn' },
  { slug: 'fu',  name: 'Snapchat' },
  { slug: 'hb',  name: 'Twitch' },
  { slug: 'mt',  name: 'Steam' },
]

// ── Hoisted sub-components (cannot be defined inside render) ─────────────────

function CountryDropdown({
  loading, filteredCountries, selectedCountry, activeCountry, isOpen, search,
  onToggle, onClose, onSelect, onSearchChange,
}: {
  loading: boolean
  filteredCountries: Country[]
  selectedCountry: string | null
  activeCountry: Country | undefined
  isOpen: boolean
  search: string
  onToggle: () => void
  onClose: () => void
  onSelect: (code: string) => void
  onSearchChange: (v: string) => void
}) {
  if (loading) return <div className="text-sm text-secondary animate-pulse py-2">Loading countries…</div>
  return (
    <div className="premium-dropdown-container">
      <button
        type="button"
        onClick={onToggle}
        className="premium-dropdown-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
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
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="premium-dropdown-overlay" onClick={onClose} />
          <div className="premium-dropdown-menu">
            <div className="premium-dropdown-search-wrap">
              <div className="premium-dropdown-search-icon">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search countries..."
                value={search}
                onChange={e => onSearchChange(e.target.value)}
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
                  aria-selected={selectedCountry === c.code}
                  onClick={() => { onSelect(c.code); onClose(); onSearchChange('') }}
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

function OrderCTA({
  activeApp, isLoggedIn, renting, selectedCountry, price, isCtaReady, onRent, pulse = false,
}: {
  activeApp: Service | null
  isLoggedIn: boolean
  renting: boolean
  selectedCountry: string | null
  price: number | null
  isCtaReady: boolean
  onRent: () => void
  pulse?: boolean
}) {
  if (!activeApp) return null
  if (isLoggedIn) {
    return (
      <button
        type="button"
        onClick={onRent}
        disabled={renting || !selectedCountry || price === null}
        className={`btn btn-primary w-full py-3 flex items-center justify-center gap-2${pulse && isCtaReady ? ' btn-ready-pulse' : ''}`}
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

function StepBar({
  selectedApp, selectedCountry, price, priceLoading,
}: {
  selectedApp: string | null
  selectedCountry: string | null
  price: number | null
  priceLoading: boolean
}) {
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
        <div className="step-dot">3</div>
        <span className="step-label">Confirm</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardClient({
  initialServices,
  isLoggedIn,
  recentTransactions,
  recentRentals,
  servicesError,
  walletBalance,
}: {
  initialServices: Service[]
  isLoggedIn: boolean
  recentTransactions?: TxRecord[]
  recentRentals?: RentalRecord[]
  servicesError?: boolean
  walletBalance?: number
}) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Canonical name overrides: keyed by both slug AND name so we catch providers
  // that use different service_id values (e.g. "ig" instead of "instagram")
  const slugToName = new Map(POPULAR_SERVICES.map(p => [p.slug.toLowerCase(), p.name]))
  const nameToName = new Map(POPULAR_SERVICES.map(p => [p.name.toLowerCase(), p.name]))
  const normalizedServices = initialServices.map(s => ({
    ...s,
    name:
      slugToName.get(s.slug.toLowerCase()) ||
      nameToName.get(s.name.toLowerCase()) ||
      s.name,
  }))

  const sortedServices = [...normalizedServices].sort((a, b) => {
    const aIndex = POPULAR_SERVICES.findIndex(
      p =>
        p.slug.toLowerCase() === a.slug.toLowerCase() ||
        p.name.toLowerCase() === a.name.toLowerCase()
    )
    const bIndex = POPULAR_SERVICES.findIndex(
      p =>
        p.slug.toLowerCase() === b.slug.toLowerCase() ||
        p.name.toLowerCase() === b.name.toLowerCase()
    )
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1) return -1
    if (bIndex !== -1) return 1
    return a.name.localeCompare(b.name)
  })

  const filteredApps = sortedServices.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase())
  )

  // Match by slug first, then by name — ensures we use the provider's actual service_id
  const popularApps = POPULAR_SERVICES.map(p => {
    const found = sortedServices.find(
      s =>
        s.slug.toLowerCase() === p.slug.toLowerCase() ||
        s.name.toLowerCase() === p.name.toLowerCase()
    )
    return found || p  // fallback only when service is absent from provider catalog
  })

  const activeApp =
    selectedApp
      ? sortedServices.find(s => s.slug.toLowerCase() === selectedApp.toLowerCase()) ||
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
      .then(d => {
        setCountries(d.countries || [])
        if (d.available === false) {
          setError('This service is not currently available. Please try a different one.')
        }
      })
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
      .then(d => {
        if (d.price?.available === false) {
          setError('Not available for this country. Try another.')
          setPrice(null)
        } else {
          setPrice(d.price?.price_usd ?? null)
        }
      })
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


  const displayApps = search
    ? (filteredApps.length > 0 ? filteredApps.slice(0, 24) : [])
    : popularApps

  return (
    <div className="dashboard-layout-wrapper">


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
      <div className={`catalog-grid-layout${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>

        {/* Left sidebar — desktop only */}
        <aside className={`catalog-sidebar${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
          <div className="sidebar-collapse-bar">
            <button
              type="button"
              className="sidebar-collapse-btn"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed(c => !c)}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>
          <div className="catalog-sidebar-search">
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
          <div className="catalog-sidebar-list overflow-y-auto pb-4">
            {filteredApps.map(app => (
              <button
                key={app.slug}
                type="button"
                className={`catalog-sidebar-item flex items-center w-full text-left${selectedApp === app.slug ? ' active' : ''}`}
                onClick={() => openSheet(app.slug)}
                title={sidebarCollapsed ? app.name : undefined}
              >
                <ServiceIcon slug={app.slug} name={app.name} iconUrl={app.icon_url} size={22} iconSize={13} />
                <span className="sidebar-item-name text-sm font-semibold text-primary">{app.name}</span>
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
                  <ServiceIcon slug={app.slug} name={app.name} iconUrl={app.icon_url} size={40} iconSize={24} />
                  <div className="catalog-app-name">{app.name}</div>
                  <span className="catalog-tap-hint" aria-hidden="true">Tap to order →</span>
                </button>
              ))
            )}
          </div>


          {/* Recent Activity */}
          {isLoggedIn && recentTransactions && recentTransactions.length > 0 && (
            <div className="recent-activity-section">
              <div className="glass-panel">
              <div className="activity-header flex justify-between items-center">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <Link href="/dashboard/wallet" className="text-sm font-semibold text-accent no-underline hover-link transition-colors">View all</Link>
              </div>
              <div className="p-5">
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
            </div>
          )}
        </main>

        {/* Right panel — tablet + desktop */}
        <aside className="catalog-right">

          {/* Step bar */}
          <StepBar selectedApp={selectedApp} selectedCountry={selectedCountry} price={price} priceLoading={priceLoading} />

          <div className={`catalog-right-hero-dynamic${activeApp ? ' has-service' : ''}`}>
            <div className="dynamic-hero-icon">
              {activeApp ? (
                <ServiceIcon slug={activeApp.slug} name={activeApp.name} iconUrl={activeApp.icon_url} size={48} />
              ) : (
                <div className="order-panel-globe">
                  <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </div>
              )}
            </div>
            <h2 className="dynamic-hero-title">{activeApp ? activeApp.name : 'Real SMS Numbers'}</h2>
            <p className={`dynamic-hero-price${price !== null ? ' dynamic-hero-price--active' : ''}`}>
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
              <div className="order-panel-country-section">
                <label className="catalog-country-label">
                  Select Country{' '}
                  {!countriesLoading && countries.length > 0 && (
                    <span className="catalog-country-count">{countries.length} available</span>
                  )}
                </label>
                <CountryDropdown
                  loading={countriesLoading}
                  filteredCountries={filteredCountries}
                  selectedCountry={selectedCountry}
                  activeCountry={activeCountry}
                  isOpen={isDropdownOpen}
                  search={countrySearch}
                  onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                  onClose={() => setIsDropdownOpen(false)}
                  onSelect={setSelectedCountry}
                  onSearchChange={setCountrySearch}
                />
              </div>
            ) : (
              <p className="order-panel-empty-text">
                Select a service from the grid to get started.
              </p>
            )}

            {activeApp && error && (
              <div className="text-xs text-danger mb-4 bg-danger/10 p-2.5 rounded-lg border border-danger/20">
                {error}
                {error.startsWith('Insufficient') && (
                  <Link href="/dashboard/wallet#topup-card" className="sheet-topup-link">
                    Top Up Wallet →
                  </Link>
                )}
              </div>
            )}

            {activeApp ? (
              <>
                <ul className="order-summary-features">
                  <li>Real SIM Cards</li>
                  <li>145+ Countries</li>
                  <li>Auto-Refund on failure</li>
                </ul>
                <OrderCTA
                  pulse
                  activeApp={activeApp}
                  isLoggedIn={isLoggedIn}
                  renting={renting}
                  selectedCountry={selectedCountry}
                  price={price}
                  isCtaReady={isCtaReady}
                  onRent={handleRent}
                />
                <p className="catalog-price-footnote">One-time charge. Auto-refund if no SMS received.</p>
                {isLoggedIn && walletBalance !== undefined && (
                  <p className="catalog-wallet-hint">
                    Balance:{' '}
                    <span className={walletBalance < (price ?? 0) && price !== null ? 'catalog-wallet-hint--low' : ''}>
                      ${walletBalance.toFixed(2)}
                    </span>
                    {walletBalance < (price ?? 0) && price !== null && !error && (
                      <Link href="/dashboard/wallet#topup-card" className="catalog-wallet-topup">Top Up →</Link>
                    )}
                  </p>
                )}
              </>
            ) : (
              <button type="button" disabled className="catalog-right-cta">
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
              <CountryDropdown
                loading={countriesLoading}
                filteredCountries={filteredCountries}
                selectedCountry={selectedCountry}
                activeCountry={activeCountry}
                isOpen={isDropdownOpen}
                search={countrySearch}
                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                onClose={() => setIsDropdownOpen(false)}
                onSelect={setSelectedCountry}
                onSearchChange={setCountrySearch}
              />

              {error && (
                <div className="text-xs text-danger mt-3 bg-danger/10 p-2.5 rounded-lg border border-danger/20">
                  {error}
                  {error.startsWith('Insufficient') && (
                    <Link href="/dashboard/wallet#topup-card" className="sheet-topup-link">
                      Top Up Wallet →
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-3">
                <OrderCTA
                  pulse
                  activeApp={activeApp}
                  isLoggedIn={isLoggedIn}
                  renting={renting}
                  selectedCountry={selectedCountry}
                  price={price}
                  isCtaReady={isCtaReady}
                  onRent={handleRent}
                />
                <p className="catalog-price-footnote">One-time charge. Auto-refund if no SMS received.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
