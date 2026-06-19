'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ServiceIcon from '@/components/ServiceIcon'

interface Country {
  code: string
  name: string
  flag?: string
}

interface Service {
  slug: string
  name: string
  icon_url?: string
}

function CountryFlag({ code, name }: { code: string; name: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`}
      alt={name}
      width={20}
      height={15}
      style={{ borderRadius: 2, flexShrink: 0 }}
      onError={(e) => {
        const el = e.currentTarget as HTMLImageElement
        el.style.display = 'none'
      }}
    />
  )
}

export default function RentalsClient({
  initialCountries,
  initialServices,
  isLoggedIn,
}: {
  initialCountries: Country[]
  initialServices: Service[]
  isLoggedIn: boolean
}) {
  const [search, setSearch] = useState('')
  const [serviceSearch, setServiceSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [price, setPrice] = useState<number | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)

  const filteredCountries = initialCountries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredServices = initialServices.filter(s =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  )

  const activeCountry = initialCountries.find(c => c.code === selectedCountry) || initialCountries[0] || null
  const activeApp = initialServices.find(s => s.slug === selectedApp) || initialServices[0] || null

  // Fetch price whenever both country and service are selected
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const country = selectedCountry || initialCountries[0]?.code
    const service = selectedApp || initialServices[0]?.slug
    if (!country || !service) return

    setPriceLoading(true)
    setPrice(null)
    fetch(`/api/price?service=${service}&country=${country}`)
      .then(r => r.json())
      .then(d => setPrice(d.price?.price_usd ?? null))
      .catch(() => setPrice(null))
      .finally(() => setPriceLoading(false))
  }, [selectedCountry, selectedApp, initialCountries, initialServices])
  /* eslint-enable react-hooks/set-state-in-effect */

  const priceDisplay = priceLoading
    ? '…'
    : price !== null
    ? `$${price.toFixed(2)}`
    : '—'

  return (
    <div className="catalog-grid-layout">
      {/* Left Sidebar — Countries */}
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-search">
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="catalog-sidebar-header">
          <span>AVAILABLE NOW - {filteredCountries.length}</span>
        </div>
        <div className="catalog-sidebar-list">
          {filteredCountries.map(c => (
            <div
              key={c.code}
              className={`catalog-sidebar-item ${selectedCountry === c.code ? 'active' : ''}`}
              onClick={() => setSelectedCountry(c.code)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedCountry(c.code) }}
            >
              <div className="catalog-sidebar-item-left">
                <CountryFlag code={c.code} name={c.name} />
                {c.name}
              </div>
            </div>
          ))}

          <div className="catalog-sidebar-footer">
            <div className="text-tertiary text-xs mb-1">Can&apos;t find yours?</div>
            <button className="btn btn-secondary w-full text-xs" style={{ padding: '0.5rem' }}>+ Request it</button>
          </div>
        </div>
      </aside>

      {/* Main Content — Services */}
      <main className="catalog-main">
        <h1>Rent a Number</h1>
        <div className="catalog-search-bar">
          <div className="catalog-search-input-wrap">
            <input
              type="text"
              className="catalog-search-input"
              placeholder={`Search ${initialServices.length} services in ${activeCountry?.name || '...'}...`}
              value={serviceSearch}
              onChange={e => setServiceSearch(e.target.value)}
            />
            <span className="catalog-search-icon">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          <div className="catalog-filter-pills">
            <button className="catalog-filter-pill">Full Access</button>
            <button className="catalog-filter-pill active">Platform Rental</button>
          </div>
        </div>

        <div className="catalog-section-label">POPULAR</div>

        <div className="catalog-apps-grid">
          {filteredServices.slice(0, 24).map(app => (
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
      </main>

      {/* Right Sidebar — Order Summary */}
      <aside className="catalog-right" style={{ background: '#f8fafc' }}>
        <div className="order-summary-header">
          <h2 className="order-summary-title">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Order Summary
          </h2>
          <div className="order-count-badge">1</div>
        </div>

        {activeApp && activeCountry && (
          <div className="order-selected-app">
            <div className="order-selected-row">
              <div className="order-selected-info">
                <ServiceIcon slug={activeApp.slug} name={activeApp.name} size={32} />
                <div>
                  <div className="order-selected-name">{activeApp.name}</div>
                  <div className="order-selected-location">
                    <CountryFlag code={activeCountry.code} name={activeCountry.name} />
                    {activeCountry.name}
                  </div>
                </div>
              </div>
              <div className="order-selected-price">
                <div className="order-price-value">{priceDisplay}</div>
                <div className="order-price-duration">1d</div>
              </div>
            </div>

            <div className="order-duration-label">DURATION</div>
            <div className="order-duration-options">
              <label className="order-duration-option selected">
                <div className="order-duration-radio">
                  <input type="radio" name="duration" defaultChecked />
                  <span className="order-duration-label-text">1 day</span>
                </div>
                <span className="order-duration-price">{priceDisplay}</span>
              </label>
              <label className="order-duration-option unselected">
                <div className="order-duration-radio">
                  <input type="radio" name="duration" />
                  <span className="order-duration-label-text">3 days</span>
                </div>
                <div className="order-selected-price">
                  <div className="order-duration-price">
                    {price !== null ? `$${(price * 3).toFixed(2)}` : '—'}
                  </div>
                  <div className="order-duration-bundle">3-day bundle</div>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="order-footer">
          <div className="order-total-row">
            <span className="order-total-label">1 rental</span>
            <span className="order-total-value">{priceDisplay}</span>
          </div>
          <Link href={isLoggedIn ? '/dashboard/numbers' : '/register'} className="btn btn-primary w-full" style={{ marginBottom: '0.5rem' }}>
            {isLoggedIn ? 'Rent this Number →' : 'Sign up to checkout'}
          </Link>
          <div className="order-guarantee">
            <span>✓</span> 20-min no SMS refund
          </div>
        </div>
      </aside>
    </div>
  )
}
