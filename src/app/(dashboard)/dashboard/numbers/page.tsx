'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

export default function RentNumberPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [renting, setRenting] = useState(false)
  const [price, setPrice] = useState<number | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetch('/api/services')
      .then(r => r.json())
      .then(d => {
        const list: Service[] = d.services ?? []
        setServices(list)
        setLoading(false)
        const preSelected = searchParams.get('service')
        if (preSelected && list.some(s => s.slug === preSelected)) {
          setSelectedService(preSelected)
          setSelectedCountry('')
          setCountries([])
          fetch(`/api/countries?service=${preSelected}`)
            .then(r => r.json())
            .then(d => setCountries(d.countries ?? []))
            .catch(() => setError('Failed to load countries'))
        }
      })
      .catch(() => {
        setError('Failed to load services. Check your VirtualSMS API key.')
        setLoading(false)
      })
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  // Fetch price when both service and country are selected
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!selectedService || !selectedCountry) return
    setPriceLoading(true)
    setPrice(null)
    fetch(`/api/price?service=${selectedService}&country=${selectedCountry}`)
      .then(r => r.json())
      .then(d => setPrice(d.price?.price_usd ?? null))
      .catch(() => setPrice(null))
      .finally(() => setPriceLoading(false))
  }, [selectedService, selectedCountry])
  /* eslint-enable react-hooks/set-state-in-effect */

  const loadCountries = useCallback((service: string) => {
    setSelectedCountry('')
    setCountries([])
    fetch(`/api/countries?service=${service}`)
      .then(r => r.json())
      .then(d => setCountries(d.countries ?? []))
      .catch(() => setError('Failed to load countries'))
  }, [])

  function selectService(slug: string) {
    setSelectedService(slug)
    loadCountries(slug)
    setSearch('')
  }

  async function handleRent() {
    if (!selectedService || !selectedCountry) return
    setRenting(true)
    setError(null)
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: selectedService, country: selectedCountry }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error)
      }
      router.push(`/dashboard/rentals/${data.rental.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rent number')
      setRenting(false)
    }
  }

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Rent a Number</h1>
        <p className="page-subtitle">Select a service, pick a country, and get your SMS instantly</p>
      </div>

      {error && (
        <div className="alert-error">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {error}
        </div>
      )}

      <div className="rent-flow">
        {/* Step 1: Choose Service */}
        <div className="rent-step glass-panel">
          <div className="step-header">
            <span className="step-badge">1</span>
            <h2 className="step-title">Choose Service</h2>
          </div>
          <input
            type="search"
            className="input-field"
            placeholder="Search services (WhatsApp, Telegram…)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="service-search"
          />

          {loading ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="service-skeleton" />
              ))}
            </div>
          ) : (
            <div className="service-grid">
              {filtered.slice(0, 40).map(s => (
                <button
                  key={s.slug}
                  className={`service-btn${selectedService === s.slug ? ' selected' : ''}`}
                  onClick={() => selectService(s.slug)}
                  id={`btn-service-${s.slug}`}
                >
                  <ServiceIcon slug={s.slug} name={s.name} size={28} iconSize={16} />
                  <span className="service-name">{s.name}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="no-results">No services match your search</p>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Choose Country */}
        {selectedService && (
          <div className="rent-step glass-panel animate-fade-in">
            <div className="step-header">
              <span className="step-badge">2</span>
              <h2 className="step-title">Choose Country</h2>
            </div>
            <div className="country-grid">
              {countries.length === 0 ? (
                <p className="loading-text">Loading countries…</p>
              ) : (
                countries.map(c => (
                  <button
                    key={c.code}
                    className={`country-btn${selectedCountry === c.code ? ' selected' : ''}`}
                    onClick={() => setSelectedCountry(c.code)}
                    id={`country-${c.code}`}
                  >
                    {c.code && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`https://flagcdn.com/24x18/${c.code.toLowerCase()}.png`}
                        alt={c.name}
                        className="country-flag"
                        width={24}
                        height={18}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                    )}
                    <span>{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {selectedService && selectedCountry && (
          <div className="rent-step glass-panel animate-fade-in rent-confirm">
            <div className="step-header">
              <span className="step-badge">3</span>
              <h2 className="step-title">Confirm & Rent</h2>
            </div>
            <div className="confirm-summary">
              <div className="confirm-row">
                <span>Service</span>
                <strong>{services.find(s => s.slug === selectedService)?.name}</strong>
              </div>
              <div className="confirm-row">
                <span>Country</span>
                <strong>{countries.find(c => c.code === selectedCountry)?.name}</strong>
              </div>
              <div className="confirm-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                <span>Price</span>
                <strong style={{ color: 'var(--accent-primary)' }}>
                  {priceLoading ? '…' : price !== null ? `$${price.toFixed(2)}` : '—'}
                </strong>
              </div>
            </div>
            <button
              className="btn btn-primary rent-btn"
              onClick={handleRent}
              disabled={renting}
              id="rent-confirm-btn"
            >
              {renting ? (
                <>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Renting…
                </>
              ) : (
                <>
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  Rent Number Now
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
