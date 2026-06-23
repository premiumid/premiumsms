'use client'

import { useState, useEffect, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import FormattedDate from '@/components/FormattedDate'

interface UserItem {
  id: string
  email: string
  role: 'user' | 'admin'
  balance: number
  created_at: string
}

interface RentalItem {
  id: string
  phone_number: string
  status: string
  price: number
  created_at: string
  provider_name: string
  user_email: string
}

interface TrendItem extends Record<string, string | number | undefined> {
  date: string
  count?: number
  amount?: number
}

interface AdminClientProps {
  initialUsers: UserItem[]
  initialRentals: RentalItem[]
  totalRevenue: number
  providerBalance: number
  totalRentalsCount: number
  registrationsTrend: TrendItem[]
  topupsTrend: TrendItem[]
  rentalsTrend: TrendItem[]
}

function TrendChart({
  title,
  data,
  valueKey,
  secondValueKey,
  prefix = ''
}: {
  title: string
  data: Record<string, string | number | undefined>[]
  valueKey: string
  secondValueKey?: string
  prefix?: string
}) {
  const values = data.map(d => Number(d[valueKey] ?? 0))
  const secondValues = secondValueKey ? data.map(d => Number(d[secondValueKey] ?? 0)) : []
  const maxVal = Math.max(...values, ...secondValues, 1)

  const W = 500, H = 180, PX = 40, PY = 25
  const CW = W - PX * 2, CH = H - PY * 2

  const points = data.map((d, i) => {
    const x = PX + (i / Math.max(data.length - 1, 1)) * CW
    const y = H - PY - (Number(d[valueKey] ?? 0) / maxVal) * CH
    return { x, y, value: d[valueKey], date: d.date }
  })

  const secondPoints = secondValueKey
    ? data.map((d, i) => {
        const x = PX + (i / Math.max(data.length - 1, 1)) * CW
        const y = H - PY - (Number(d[secondValueKey] ?? 0) / maxVal) * CH
        return { x, y, value: d[secondValueKey] }
      })
    : []

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${H - PY} L ${points[0].x} ${H - PY} Z`
    : ''

  const secondLinePath = secondPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="admin-chart-card">
      <div className="admin-chart-header">
        <h3 className="admin-chart-title">{title}</h3>
        {secondValueKey && (
          <div className="admin-chart-legend">
            <span className="admin-legend-item" style={{ color: 'var(--accent)' }}>Rentals</span>
            <span className="admin-legend-item" style={{ color: 'var(--warning)' }}>Signups</span>
          </div>
        )}
      </div>
      <svg aria-hidden="true" viewBox={`0 0 ${W} ${H}`} className="admin-chart-svg">
        <defs>
          <linearGradient id={`chart-fill-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((ratio, i) => {
          const y = PY + (1 - ratio) * CH
          return (
            <line key={i} x1={PX} y1={y} x2={W - PX} y2={y}
              stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
          )
        })}
        {points.length > 0 && (
          <>
            <path d={areaPath} fill={`url(#chart-fill-${valueKey})`} />
            <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}
        {secondValueKey && secondPoints.length > 0 && (
          <path d={secondLinePath} fill="none" stroke="var(--warning)" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {points.map((p, i) => (
          <g key={`p-${i}`}>
            <circle cx={p.x} cy={p.y} r="4" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fill="var(--text)" fontWeight="600">
              {prefix}{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            </text>
            <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--text-faint)">
              {typeof p.date === 'string' ? p.date.slice(5) : p.date}
            </text>
          </g>
        ))}
        {secondPoints.map((p, i) => (
          <g key={`s-${i}`}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="var(--bg-card)" stroke="var(--warning)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="var(--warning)" fontWeight="600">{p.value}</text>
          </g>
        ))}
      </svg>
      <table className="sr-only" aria-label={`${title} data`}>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value</th>
            {secondValueKey && <th scope="col">{secondValueKey}</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{String(d.date)}</td>
              <td>{prefix}{d[valueKey]}</td>
              {secondValueKey && <td>{d[secondValueKey]}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', active: 'Active', received: 'Received',
  expired: 'Expired', canceled: 'Canceled', refunded: 'Refunded',
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

export default function AdminClient({
  initialUsers,
  initialRentals,
  totalRevenue,
  providerBalance,
  totalRentalsCount,
  registrationsTrend,
  topupsTrend,
  rentalsTrend
}: AdminClientProps) {
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const rentals = initialRentals

  const [health, setHealth] = useState<{
    database: { healthy: boolean; latencyMs: number; error: string | null }
    provider: { healthy: boolean; latencyMs: number; balance: number; error: string | null }
    stats: { active: number; completed: number; cancelled: number; expired: number; total: number }
  } | null>(null)
  const [isLoadingHealth, setIsLoadingHealth] = useState(false)

  async function fetchHealth() {
    setIsLoadingHealth(true)
    try {
      const res = await fetch('/api/admin/health')
      const data = await res.json()
      if (res.ok) {
        startTransition(() => setHealth(data))
      }
    } catch (err) {
      console.error('Failed to fetch health check:', err)
    } finally {
      startTransition(() => setIsLoadingHealth(false))
    }
  }

  useEffect(() => {
    startTransition(() => {
      fetchHealth()
    })
  }, [])

  const [userSearch, setUserSearch] = useState('')
  const [rentalSearch, setRentalSearch] = useState('')

  const [targetUserId, setTargetUserId] = useState('')
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustAction, setAdjustAction] = useState<'credit' | 'debit'>('credit')
  const [adjustReason, setAdjustReason] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  async function handleAdjustBalance(e: React.FormEvent) {
    e.preventDefault()
    if (!targetUserId || !adjustAmount || isNaN(Number(adjustAmount)) || Number(adjustAmount) <= 0) {
      setFormError('Select a user and enter a valid amount')
      return
    }
    setFormError(null)
    setFormSuccess(null)
    setIsAdjusting(true)
    try {
      const res = await fetch('/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, amount: Number(adjustAmount), action: adjustAction, reason: adjustReason })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to adjust balance')
      setUsers(users.map(u => u.id === targetUserId ? { ...u, balance: data.newBalance } : u))
      setFormSuccess(`Balance adjusted. New: $${data.newBalance.toFixed(2)}`)
      setAdjustAmount('')
      setAdjustReason('')
      router.refresh()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Adjustment failed')
    } finally {
      setIsAdjusting(false)
    }
  }

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(userSearch.toLowerCase()))
  const filteredRentals = rentals.filter(r =>
    r.phone_number.includes(rentalSearch) ||
    r.user_email.toLowerCase().includes(rentalSearch.toLowerCase()) ||
    r.provider_name.toLowerCase().includes(rentalSearch.toLowerCase())
  )

  return (
    <div className="admin-page">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--accent">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <p className="admin-stat-label">Total Revenue</p>
          <p className="admin-stat-value">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--neutral">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          </div>
          <p className="admin-stat-label">Provider Balance</p>
          <p className="admin-stat-value">${providerBalance.toFixed(2)}</p>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon--accent">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <p className="admin-stat-label">Total Orders</p>
          <p className="admin-stat-value">{totalRentalsCount}</p>
        </div>
      </div>

      {/* System Health + Charts */}
      <div className="admin-monitoring-grid">
        <div className="admin-card admin-health-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">System Health</h3>
            <button className="admin-refresh-btn" onClick={fetchHealth} disabled={isLoadingHealth}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              {isLoadingHealth ? '...' : 'Refresh'}
            </button>
          </div>
          <div className="admin-health-rows">
            <div className="admin-health-row">
              <div>
                <p className="admin-health-name">Database</p>
                <p className="admin-health-meta">Supabase Postgres</p>
              </div>
              <div className="admin-health-value">
                {health ? (
                  <><span className={`admin-health-dot ${health.database.healthy ? 'admin-dot--ok' : 'admin-dot--err'}`} />{health.database.latencyMs}ms</>
                ) : (
                  <span className="admin-health-loading">...</span>
                )}
              </div>
            </div>
            <div className="admin-health-row">
              <div>
                <p className="admin-health-name">Upstream API</p>
                <p className="admin-health-meta">VirtualSMS</p>
              </div>
              <div className="admin-health-value">
                {health ? (
                  <><span className={`admin-health-dot ${health.provider.healthy ? 'admin-dot--ok' : 'admin-dot--err'}`} />{health.provider.latencyMs}ms</>
                ) : (
                  <span className="admin-health-loading">...</span>
                )}
              </div>
            </div>
          </div>
          <div className="admin-ratio-card">
            <p className="admin-ratio-title">Rental Status</p>
            <div className="admin-ratio-grid">
              <div className="admin-ratio-item admin-ratio-item--success">
                <span className="admin-ratio-num">{health?.stats.completed ?? '-'}</span>
                <span className="admin-ratio-lbl">Done</span>
              </div>
              <div className="admin-ratio-item admin-ratio-item--accent">
                <span className="admin-ratio-num">{health?.stats.active ?? '-'}</span>
                <span className="admin-ratio-lbl">Active</span>
              </div>
              <div className="admin-ratio-item admin-ratio-item--danger">
                <span className="admin-ratio-num">{health?.stats.cancelled ?? '-'}</span>
                <span className="admin-ratio-lbl">Cxl</span>
              </div>
              <div className="admin-ratio-item admin-ratio-item--warning">
                <span className="admin-ratio-num">{health?.stats.expired ?? '-'}</span>
                <span className="admin-ratio-lbl">Exp</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-chart-col">
          <TrendChart title="Top-Up Volume (USD)" data={topupsTrend} valueKey="amount" prefix="$" />
          <TrendChart
            title="Signups & Rentals"
            data={rentalsTrend.map((item, idx) => ({
              date: item.date,
              rentals: item.count,
              signups: registrationsTrend[idx]?.count ?? 0
            }))}
            valueKey="rentals"
            secondValueKey="signups"
          />
        </div>
      </div>

      {/* Balance Adjustment + Users */}
      <div className="admin-two-col">
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '0.25rem' }}>Adjust Balance</h2>
          <p className="admin-desc">Credit or debit a user&apos;s wallet.</p>
          <form onSubmit={handleAdjustBalance} className="admin-form">
            <div className="admin-field">
              <label className="admin-label">User</label>
              <select className="admin-select" value={targetUserId} onChange={e => setTargetUserId(e.target.value)}>
                <option value="">-- Select --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.email} (${Number(u.balance).toFixed(2)})</option>
                ))}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Action</label>
              <select className="admin-select" value={adjustAction} onChange={e => setAdjustAction(e.target.value as 'credit' | 'debit')}>
                <option value="credit">+ Credit</option>
                <option value="debit">− Debit</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Amount (USD)</label>
              <input className="admin-input" type="number" min="0.01" step="0.01" placeholder="0.00" value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Reason</label>
              <input className="admin-input" type="text" placeholder="e.g. Support compensation" value={adjustReason} onChange={e => setAdjustReason(e.target.value)} />
            </div>
            {formError && <p className="admin-msg admin-msg--error" role="alert">{formError}</p>}
            {formSuccess && <p className="admin-msg admin-msg--success" role="status">{formSuccess}</p>}
            <button className="admin-btn" type="submit" disabled={isAdjusting}>{isAdjusting ? 'Processing...' : 'Execute'}</button>
          </form>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: '0.25rem' }}>Users</h2>
          <label htmlFor="admin-user-search" className="sr-only">Search users by email</label>
          <input id="admin-user-search" className="admin-input" type="search" placeholder="Search email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
          <div className="admin-user-list" role="listbox" aria-label="Select a user">
            {filteredUsers.map(u => (
              <button key={u.id} role="option" aria-selected={targetUserId === u.id} className={`admin-user-row${targetUserId === u.id ? ' admin-user-row--selected' : ''}`} onClick={() => setTargetUserId(u.id)}>
                <div className="admin-user-info">
                  <p className="admin-user-email">{u.email}</p>
                  <span className={`admin-role-badge admin-role-badge--${u.role}`}>{u.role}</span>
                </div>
                <p className="admin-user-balance">${Number(u.balance).toFixed(2)}</p>
              </button>
            ))}
            {filteredUsers.length === 0 && <p className="admin-empty">No users found</p>}
          </div>
        </div>
      </div>

      {/* Rentals */}
      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2 className="admin-card-title" style={{ marginBottom: '0.75rem' }}>Rentals</h2>
        <label htmlFor="admin-rental-search" className="sr-only">Search rentals</label>
        <input id="admin-rental-search" className="admin-input" type="search" placeholder="Search by phone, email, or service..." value={rentalSearch} onChange={e => setRentalSearch(e.target.value)} style={{ marginBottom: '0.75rem', maxWidth: '360px' }} />
        {filteredRentals.length === 0 ? (
          <p className="admin-empty">No rentals found</p>
        ) : (
          <div className="admin-rentals-grid">
            {filteredRentals.map(r => {
              const parts = r.provider_name.split('|')
              const svc = displayService(parts[1] || '')
              const country = (parts[2] || '').toUpperCase()
              return (
                <div key={r.id} className="admin-rental-card">
                  <div className="admin-rental-top">
                    <div>
                      <p className="admin-rental-service">{svc}{country ? ` (${country})` : ''}</p>
                      <p className="admin-rental-phone">{r.phone_number}</p>
                    </div>
                    <span className={`rentals-badge rentals-badge--${r.status}`}>{STATUS_LABELS[r.status] || r.status}</span>
                  </div>
                  <div className="admin-rental-meta">
                    <span className="admin-rental-user">{r.user_email}</span>
                    <span className="admin-rental-price">${Number(r.price).toFixed(2)}</span>
                    <span className="admin-rental-date"><FormattedDate date={r.created_at} type="date" /></span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
