'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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

function ServiceIcon({ service, size = 32 }: { service: Service; size?: number }) {
  const colors: Record<string, string> = {
    telegram: '#2AABEE', whatsapp: '#25D366', instagram: '#E4405F',
    facebook: '#1877F2', tiktok: '#000000', google: '#EA4335',
    twitter: '#000000', discord: '#5865F2', netflix: '#E50914',
    spotify: '#1DB954', steam: '#1b2838',
  }
  const bg = colors[service.slug.toLowerCase()] || '#0f172a'
  const iconSize = Math.round(size * 0.6)

  return (
    <div style={{ width: size, height: size, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${service.slug}/ffffff`}
        alt={service.name}
        width={iconSize}
        height={iconSize}
        style={{ display: 'block' }}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement
          el.style.display = 'none'
          const fb = el.nextElementSibling as HTMLElement | null
          if (fb) fb.style.display = 'flex'
        }}
      />
      <span style={{ display: 'none', color: 'white', fontWeight: 'bold', fontSize: size * 0.35 + 'px', alignItems: 'center', justifyContent: 'center' }}>
        {service.name[0]}
      </span>
    </div>
  )
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
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
              <div className="catalog-sidebar-item-left" style={{ gap: '0.625rem' }}>
                <CountryFlag code={c.code} name={c.name} />
                {c.name}
              </div>
            </div>
          ))}

          <div style={{ padding: '1rem', textAlign: 'center', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>Can&apos;t find yours?</div>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem' }}>+ Request it</button>
          </div>
        </div>
      </aside>

      {/* Main Content — Services */}
      <main className="catalog-main">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 700 }}>Rent a Number</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder={`Search ${initialServices.length} services in ${activeCountry?.name || '...'}...`}
              value={serviceSearch}
              onChange={e => setServiceSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '9999px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', display: 'flex' }}>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
          </div>
          <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '9999px' }}>
            <button style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', background: 'transparent', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Full Access</button>
            <button style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', background: 'white', fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-primary)', boxShadow: 'var(--shadow-sm)' }}>Platform Rental</button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>POPULAR</div>

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
              <ServiceIcon service={app} size={48} />
              <div className="catalog-app-name">{app.name}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar — Order Summary */}
      <aside className="catalog-right" style={{ background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Order Summary
          </h2>
          <div style={{ background: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-primary)', boxShadow: 'var(--shadow-sm)' }}>1</div>
        </div>

        {activeApp && activeCountry && (
          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--accent-primary)', boxShadow: '0 0 0 1px var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ServiceIcon service={activeApp} size={32} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{activeApp.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <CountryFlag code={activeCountry.code} name={activeCountry.name} />
                    {activeCountry.name}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{priceDisplay}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>1d</div>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem' }}>DURATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--accent-primary)', background: '#f5f3ff', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="duration" defaultChecked style={{ accentColor: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>1 day</span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{priceDisplay}</span>
              </label>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="radio" name="duration" style={{ accentColor: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>3 days</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {price !== null ? `$${(price * 3).toFixed(2)}` : '—'}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)' }}>3-day bundle</div>
                </div>
              </label>
            </div>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>1 rental</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{priceDisplay}</span>
          </div>
          <Link href={isLoggedIn ? '/dashboard/numbers' : '/register'} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }}>
            {isLoggedIn ? 'Rent this Number →' : 'Sign up to checkout'}
          </Link>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            <span>✓</span> 20-min no SMS refund
          </div>
        </div>
      </aside>
    </div>
  )
}
