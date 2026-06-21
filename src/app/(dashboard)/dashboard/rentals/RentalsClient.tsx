'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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

function CountryFlag({ code, name }: { code: string; name: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`https://flagcdn.com/20x15/${code.toLowerCase()}.png`}
      alt={name}
      width={20}
      height={15}
      className="rounded-[2px] shrink-0"
      onError={(e) => {
        const el = e.currentTarget as HTMLImageElement
        el.style.display = 'none'
      }}
    />
  )
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

function RentalRow({ rental }: { rental: Rental }) {
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (rental.status !== 'active') return
    const expiresAt = new Date(rental.expires_at).getTime()
    const updateTimer = () => {
      setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [rental])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <tr className="hover:bg-muted border-b border-border transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <ServiceIcon slug={rental.service_slug} name={displayService(rental.service_slug)} size={28} />
          <span className="font-semibold">{displayService(rental.service_slug)}</span>
        </div>
      </td>
      <td className="py-4 px-6 font-mono select-all" style={{ color: 'var(--text)' }}>{rental.phone_number || 'Processing…'}</td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <CountryFlag code={rental.country_code} name={rental.country_code.toUpperCase()} />
          <span className="text-secondary">{rental.country_code.toUpperCase()}</span>
        </div>
      </td>
      <td className="py-4 px-6 font-semibold" style={{ color: 'var(--text)' }}>${Number(rental.price).toFixed(2)}</td>
      <td className="py-4 px-6">
        <span className={`status-badge status-${rental.status}`}>{rental.status}</span>
      </td>
      <td className="py-4 px-6">
        {rental.status === 'active' ? (
          <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-danger animate-pulse' : 'text-accent'}`}>
            {minutes}:{String(seconds).padStart(2, '0')}
          </span>
        ) : (
          <span className="text-xs text-tertiary">
            <FormattedDate date={rental.created_at} />
          </span>
        )}
      </td>
      <td className="py-4 px-6 text-right">
        <Link href={`/dashboard/rentals/${rental.id}`} className="btn btn-secondary btn-small inline-block text-center no-underline text-xs">
          View Inbox &rarr;
        </Link>
      </td>
    </tr>
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
      if (filter !== 'all') {
        url.searchParams.set('status', filter)
      }
      if (q) {
        url.searchParams.set('search', q)
      }
      const res = await fetch(url.toString())
      const data = await res.json()
      if (res.ok) {
        setRentals(data.rentals || [])
        setTotal(data.total || 0)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // Handle pagination & filter changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (page === 1 && statusFilter === 'all' && search === '') return
    fetchRentals(page, statusFilter, search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter])

  // Debounced search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setPage(1)
      fetchRentals(1, statusFilter, search)
    }, 400)

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Realtime subscription
  useEffect(() => {
    if (!isLoggedIn) return
    const supabase = createClient()
    const channel = supabase
      .channel('rentals-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rentals'
      }, () => {
        // Trigger a refresh of the current page when DB updates
        fetchRentals(page, statusFilter, search)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isLoggedIn, page, statusFilter, search])

  return (
    <div className="dashboard-content max-w-6xl mx-auto px-4 py-8">
      <div className="page-header mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-title" style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em' }}>My Rentals</h1>
          <p className="page-subtitle text-secondary mt-1">Manage active numbers and view your receipt/inbox history.</p>
        </div>
        <Link href="/dashboard" className="btn btn-primary no-underline text-center">
          Rent a Number &rarr;
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="rentals-filter-bar">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'active', 'received', 'expired', 'canceled'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(1) }}
              className={`rentals-filter-pill ${statusFilter === st ? 'active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input
            type="search"
            placeholder="Search by phone number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rentals-search-input"
          />
          <span className="rentals-search-icon">
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold text-tertiary uppercase tracking-wider" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Country</th>
                <th className="py-4 px-6">Cost</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Time Left / Created</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && rentals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="spinner-lg" />
                      <span>Loading rentals…</span>
                    </div>
                  </td>
                </tr>
              ) : rentals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-secondary">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-tertiary"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                      <div>
                        <p className="font-bold" style={{ color: 'var(--text)' }}>No rentals found</p>
                        <p className="text-sm mt-1 text-tertiary">Select a service on the dashboard to rent a number.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                rentals.map((r) => <RentalRow key={r.id} rental={r} />)
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-muted)' }}>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Showing page <span className="font-semibold" style={{ color: 'var(--text)' }}>{page}</span> of <span className="font-semibold" style={{ color: 'var(--text)' }}>{totalPages}</span> ({total} total)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
