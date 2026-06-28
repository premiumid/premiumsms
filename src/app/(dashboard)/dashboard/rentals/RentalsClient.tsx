'use client'

import { useState, useEffect, useRef, startTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ServiceIcon from '@/components/ServiceIcon'
import { createClient } from '@/lib/supabase/client'
import FormattedDate from '@/components/FormattedDate'

export interface Rental {
  id: string
  phone_number: string
  service_slug: string
  country_code: string
  status: 'pending' | 'active' | 'received' | 'expired' | 'canceled' | 'refunded'
  price: number
  expires_at: string
  created_at: string
}

function CountryFlag({ code }: { code: string }) {
  return (
    <Image
      src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`}
      alt={code.toUpperCase()}
      width={20}
      height={15}
      className="rentals-flag"
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  active: 'Active',
  received: 'Received',
  expired: 'Expired',
  canceled: 'Canceled',
  refunded: 'Refunded',
}

function displayService(slug: string): string {
  const names: Record<string, string> = {
    telegram: 'Telegram', whatsapp: 'WhatsApp', instagram: 'Instagram',
    facebook: 'Facebook', twitter: 'Twitter / X', tiktok: 'TikTok',
    google: 'Google', discord: 'Discord', netflix: 'Netflix',
    spotify: 'Spotify', steam: 'Steam', apple: 'Apple',
    microsoft: 'Microsoft', amazon: 'Amazon', uber: 'Uber',
    paypal: 'PayPal', binance: 'Binance', coinbase: 'Coinbase',
    viber: 'Viber', line: 'LINE', snapchat: 'Snapchat',
  }
  return names[slug.toLowerCase()] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

function RentalCountdown({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const expiresAtMs = new Date(expiresAt).getTime()
    const updateTimer = () => setTimeLeft(Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000)))
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const urgent = timeLeft < 60

  return (
    <span className={`rentals-timer${urgent ? ' rentals-timer--urgent' : ''}`}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      {minutes}:{String(seconds).padStart(2, '0')}
    </span>
  )
}

function RentalCard({ rental }: { rental: Rental }) {
  return (
    <div className="rentals-card">
      <div className="rentals-card-top">
        <div className="rentals-card-service">
          <ServiceIcon slug={rental.service_slug} name={displayService(rental.service_slug)} size={28} />
          <div className="rentals-card-service-info">
            <span className="rentals-card-service-name">{displayService(rental.service_slug)}</span>
            <div className="rentals-card-country">
              <CountryFlag code={rental.country_code} />
              <span>{rental.country_code.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <span className={`rentals-badge rentals-badge--${rental.status}`}>{STATUS_LABELS[rental.status] || rental.status}</span>
      </div>

      <div className="rentals-card-number">
        <span className="rentals-card-number-label">Number</span>
        <span className="rentals-card-number-value">{rental.phone_number || 'Processing…'}</span>
      </div>

      <div className="rentals-card-meta">
        <div className="rentals-card-meta-item">
          <span className="rentals-card-meta-label">Cost</span>
          <span className="rentals-card-meta-value">${Number(rental.price).toFixed(2)}</span>
        </div>
        <div className="rentals-card-meta-item">
          <span className="rentals-card-meta-label">Created</span>
          <span className="rentals-card-meta-value"><FormattedDate date={rental.created_at} /></span>
        </div>
        {rental.status === 'active' && (
          <div className="rentals-card-meta-item">
            <span className="rentals-card-meta-label">Expires in</span>
            <RentalCountdown expiresAt={rental.expires_at} />
          </div>
        )}
        {(rental.status === 'received' || rental.status === 'expired' || rental.status === 'canceled' || rental.status === 'refunded') && (
          <div className="rentals-card-meta-item">
            <span className="rentals-card-meta-label">Status</span>
            <span className={`rentals-badge rentals-badge--${rental.status}`}>{STATUS_LABELS[rental.status] || rental.status}</span>
          </div>
        )}
      </div>

      <Link href={`/dashboard/rentals/${rental.id}`} className="rentals-card-action">
        {rental.status === 'active' || rental.status === 'pending' || rental.status === 'received' ? (
          <>View Inbox <span aria-hidden="true">&rarr;</span></>
        ) : (
          <>View Details <span aria-hidden="true">&rarr;</span></>
        )}
      </Link>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="rentals-skeleton">
      <div className="rentals-skeleton-top">
        <div className="rentals-skeleton-service">
          <div className="rentals-skeleton-avatar" />
          <div className="rentals-skeleton-lines">
            <div className="rentals-skeleton-line rentals-skeleton-line--name" />
            <div className="rentals-skeleton-line rentals-skeleton-line--country" />
          </div>
        </div>
        <div className="rentals-skeleton-badge" />
      </div>
      <div className="rentals-skeleton-number">
        <div className="rentals-skeleton-line rentals-skeleton-line--label" />
        <div className="rentals-skeleton-line rentals-skeleton-line--phone" />
      </div>
      <div className="rentals-skeleton-meta">
        <div className="rentals-skeleton-line rentals-skeleton-line--meta" />
        <div className="rentals-skeleton-line rentals-skeleton-line--meta" />
      </div>
      <div className="rentals-skeleton-action" />
    </div>
  )
}

export default function RentalsClient({
  initialRentals,
  initialTotal,
  isLoggedIn,
}: {
  initialRentals: Rental[]
  initialTotal: number
  isLoggedIn: boolean
}) {
  const [rentals, setRentals] = useState<Rental[]>(initialRentals)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const limit = 15
  const totalPages = Math.ceil(total / limit)

  const fetchRentals = async (p: number, filter: string, q: string) => {
    setLoading(true)
    try {
      const url = new URL('/api/rentals', window.location.origin)
      url.searchParams.set('page', String(p))
      url.searchParams.set('limit', String(limit))
      if (filter !== 'all') url.searchParams.set('status', filter)
      if (q) url.searchParams.set('search', q)
      const res = await fetch(url.toString())
      const data = await res.json()
      if (res.ok) {
        startTransition(() => {
          setRentals(data.rentals || [])
          setTotal(data.total || 0)
        })
      }
    } catch { /* ignore */ } finally {
      startTransition(() => setLoading(false))
    }
  }

  useEffect(() => {
    if (page === 1 && statusFilter === 'all' && search === '') return
    startTransition(() => {
      fetchRentals(page, statusFilter, search)
    })
  }, [page, statusFilter, search])

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      startTransition(() => {
        setPage(1)
        fetchRentals(1, statusFilter, search)
      })
    }, 400)
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current) }
  }, [search, statusFilter])

  useEffect(() => {
    if (!isLoggedIn) return
    const supabase = createClient()
    const channel = supabase
      .channel('rentals-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, () => {
        fetchRentals(page, statusFilter, search)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [isLoggedIn, page, statusFilter, search])

  return (
    <div className="rentals-page">
      {/* Header */}
      <div className="rentals-page-header">
        <div>
          <h1 className="rentals-page-title">My Rentals</h1>
          <p className="rentals-page-subtitle">Manage your active numbers and view receipt history.</p>
        </div>
        <Link href="/dashboard" className="btn btn-primary">
          Rent a Number &rarr;
        </Link>
      </div>

      {/* Filters */}
      <div className="rentals-filter-bar">
        <div className="rentals-filter-pills" role="tablist" aria-label="Filter rentals by status">
          {['all', 'active', 'received', 'expired', 'canceled'].map((st) => (
            <button
              key={st}
              type="button"
              role="tab"
              aria-selected={statusFilter === st ? 'true' : 'false'}
              onClick={() => { setStatusFilter(st); setPage(1) }}
              className={`rentals-filter-pill${statusFilter === st ? ' active' : ''}`}
            >
              {st === 'all' ? 'All' : STATUS_LABELS[st] || st}
            </button>
          ))}
        </div>
        <div className="rentals-search-wrap">
          <label htmlFor="rentals-search-input" className="sr-only">Search rentals by phone number</label>
          <svg className="rentals-search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="search"
            id="rentals-search-input"
            placeholder="Search by phone number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rentals-search-input"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="rentals-grid">
        {loading && rentals.length === 0 ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : rentals.length === 0 ? (
          <div className="rentals-empty">
            <svg width="48" height="48" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <p className="rentals-empty-title">No rentals found</p>
            <p className="rentals-empty-desc">Select a service on the dashboard to rent a number.</p>
            <Link href="/dashboard" className="btn btn-primary">Browse Services</Link>
          </div>
        ) : (
          rentals.map((r) => <RentalCard key={r.id} rental={r} />)
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="rentals-pagination">
          <span className="rentals-pagination-info">
            Page {page} of {totalPages} &middot; {total} total
          </span>
          <div className="rentals-pagination-btns">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rentals-pagination-btn"
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2)
              const p = start + i
              if (p > totalPages) return null
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`rentals-pagination-page${p === page ? ' active' : ''}`}
                >
                  {p}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rentals-pagination-btn"
            >
              Next
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
