'use client'

import { useState, useEffect } from 'react'
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

type ChartDataItem = Record<string, string | number | undefined>

function SVGChart({ 
  title, 
  data, 
  valueKey, 
  secondValueKey, 
  prefix = '' 
}: { 
  title: string
  data: ChartDataItem[]
  valueKey: string
  secondValueKey?: string
  prefix?: string 
}) {
  const values = data.map(d => Number(d[valueKey] ?? 0))
  const secondValues = secondValueKey ? data.map(d => Number(d[secondValueKey] ?? 0)) : []
  
  const maxVal = Math.max(...values, ...secondValues, 1)
  
  const width = 500
  const height = 180
  const paddingX = 40
  const paddingY = 25
  
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingY * 2
  
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth
    const y = height - paddingY - (Number(d[valueKey] ?? 0) / maxVal) * chartHeight
    return { x, y, value: d[valueKey], date: d.date }
  })
  
  const secondPoints = secondValueKey 
    ? data.map((d, i) => {
        const x = paddingX + (i / (data.length - 1)) * chartWidth
        const y = height - paddingY - (Number(d[secondValueKey] ?? 0) / maxVal) * chartHeight
        return { x, y, value: d[secondValueKey] }
      })
    : []
  
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : ''
    
  const secondLinePath = secondPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="glass-panel p-4 card-glow flex flex-1 flex-col justify-between">
      <div className="chart-card-header">
        <h3 className="chart-card-title">{title}</h3>
        {secondValueKey && (
          <div className="chart-legend-row">
            <span className="chart-legend-item" style={{ color: 'var(--accent-muted)' }}>
              <span className="chart-legend-dot" style={{ background: 'var(--accent)' }} /> Rentals
            </span>
            <span className="chart-legend-item" style={{ color: 'var(--warning)' }}>
              <span className="chart-legend-dot" style={{ background: 'var(--warning)' }} /> Signups
            </span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <svg aria-hidden="true" viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
          <defs>
            <linearGradient id={`chart-gradient-${valueKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = paddingY + ratio * chartHeight
            return (
              <line 
                key={i} 
                x1={paddingX} 
                y1={y} 
                x2={width - paddingX} 
                y2={y} 
                stroke="var(--border)" 
                strokeDasharray="4 4" 
                strokeWidth="1" 
              />
            )
          })}
          
          {/* Areas & Lines */}
          {points.length > 0 && (
            <>
              <path d={areaPath} fill={`url(#chart-gradient-${valueKey})`} />
              <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </>
          )}
          
          {secondValueKey && secondPoints.length > 0 && (
            <path d={secondLinePath} fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
          )}
          
          {/* Main dots */}
          {points.map((p, i) => (
            <g key={`first-${i}`} className="chart-dot-group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="4.5" fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2.5" className="chart-dot" />
              <text 
                x={p.x} 
                y={p.y - 12} 
                textAnchor="middle" 
                fontSize="10" 
                fill="var(--text)" 
                fontWeight="600"
                className="chart-tooltip"
              >
                {prefix}{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
              </text>
              <text 
                x={p.x} 
                y={height - 5} 
                textAnchor="middle" 
                fontSize="9" 
                fill="var(--text-faint)"
              >
                {typeof p.date === 'string' ? p.date.slice(5) : p.date}
              </text>
            </g>
          ))}

          {/* Second dots */}
          {secondValueKey && secondPoints.map((p, i) => (
            <g key={`second-${i}`} className="chart-dot-group cursor-pointer">
              <circle cx={p.x} cy={p.y} r="3.5" fill="var(--bg-card)" stroke="var(--warning)" strokeWidth="2" className="chart-dot" />
              <text 
                x={p.x} 
                y={p.y - 12} 
                textAnchor="middle" 
                fontSize="10" 
                fill="var(--warning)" 
                fontWeight="600"
                className="chart-tooltip"
              >
                {p.value}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
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

  // Health & Monitoring states
  const [health, setHealth] = useState<{
    database: { healthy: boolean; latencyMs: number; error: string | null }
    provider: { healthy: boolean; latencyMs: number; balance: number; error: string | null }
    stats: { active: number; completed: number; cancelled: number; expired: number; total: number }
  } | null>(null)
  const [isLoadingHealth, setIsLoadingHealth] = useState(false)

  const fetchHealth = async () => {
    setIsLoadingHealth(true)
    try {
      const res = await fetch('/api/admin/health')
      const data = await res.json()
      if (res.ok) {
        setHealth(data)
      }
    } catch (err) {
      console.error('Failed to fetch health check:', err)
    } finally {
      setIsLoadingHealth(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchHealth()
  }, [])

  // Search & filter states
  const [userSearch, setUserSearch] = useState('')
  const [rentalSearch, setRentalSearch] = useState('')

  // Balance Adjustment Form states
  const [targetUserId, setTargetUserId] = useState('')
  const [amount, setAmount] = useState('')
  const [action, setAction] = useState<'credit' | 'debit'>('credit')
  const [reason, setReason] = useState('')
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)

  const handleAdjustBalance = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetUserId || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Please select a user and enter a valid amount')
      return
    }
    setFormError(null)
    setFormSuccess(null)
    setIsAdjusting(true)

    try {
      const res = await fetch('/api/admin/adjust-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          amount: Number(amount),
          action,
          reason
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to adjust balance')

      // Update local users list for immediate feedback
      setUsers(users.map(u => {
        if (u.id === targetUserId) {
          return { ...u, balance: data.newBalance }
        }
        return u
      }))

      setFormSuccess(`Successfully adjusted balance. New balance: $${data.newBalance.toFixed(2)}`)
      setAmount('')
      setReason('')
      router.refresh()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Adjustment failed')
    } finally {
      setIsAdjusting(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const filteredRentals = rentals.filter(r =>
    r.phone_number.includes(rentalSearch) ||
    r.user_email.toLowerCase().includes(rentalSearch.toLowerCase()) ||
    r.provider_name.toLowerCase().includes(rentalSearch.toLowerCase())
  )

  return (
    <div className="admin-container">
      {/* Metrics Grid */}
      <div className="stats-grid mb-8">
        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value text-success">${totalRevenue.toFixed(2)}</p>
          </div>
          <span className="stat-action">Processed Credits</span>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          </div>
          <div className="stat-body">
            <p className="stat-label">Provider Balance</p>
            <p className="stat-value">${providerBalance.toFixed(2)}</p>
          </div>
          <span className="stat-action">Upstream SMS-API</span>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div className="stat-body">
            <p className="stat-label">Total Orders</p>
            <p className="stat-value">{totalRentalsCount}</p>
          </div>
          <span className="stat-action">Rental Placements</span>
        </div>
      </div>

      {/* System Monitoring & Visual Analytics Grid */}
      <div className="monitoring-grid mb-8">
        {/* System Health Card */}
        <div className="glass-panel p-6 system-health-card">
          <div className="system-health-header">
            <h3 className="section-title mt-0 mb-0" style={{ fontSize: '1.1rem' }}>System Health</h3>
            <button 
              onClick={fetchHealth} 
              disabled={isLoadingHealth} 
              className="btn btn-secondary py-1 px-3"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
            >
              {isLoadingHealth ? 'Polling...' : (
                <>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Refresh
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="system-status-row">
              <div>
                <p className="system-status-label">Database Latency</p>
                <p className="system-status-meta">Supabase Postgres</p>
              </div>
              <div className="system-status-value">
                {health ? (
                  <>
                    <span className={`system-status-indicator ${health.database.healthy ? 'indicator-healthy' : 'indicator-error'}`} />
                    <span className="font-mono text-sm">{health.database.latencyMs}ms</span>
                  </>
                ) : (
                  <span className="text-tertiary text-xs">Checking...</span>
                )}
              </div>
            </div>

            <div className="system-status-row">
              <div>
                <p className="system-status-label">Upstream API Status</p>
                <p className="system-status-meta">VirtualSMS integration</p>
              </div>
              <div className="system-status-value">
                {health ? (
                  <>
                    <span className={`system-status-indicator ${health.provider.healthy ? 'indicator-healthy' : 'indicator-error'}`} />
                    <span className="font-mono text-sm">{health.provider.latencyMs}ms</span>
                  </>
                ) : (
                  <span className="text-tertiary text-xs">Checking...</span>
                )}
              </div>
            </div>

            <div className="status-ratio-card">
              <p className="status-ratio-card-title">Rental Status Ratios</p>
              {health ? (
                <div className="status-ratio-grid">
                  <div className="status-ratio-item done">
                    <span className="status-ratio-number done">{health.stats.completed}</span>
                    <span className="status-ratio-label">Done</span>
                  </div>
                  <div className="status-ratio-item active">
                    <span className="status-ratio-number active">{health.stats.active}</span>
                    <span className="status-ratio-label">Active</span>
                  </div>
                  <div className="status-ratio-item cancelled">
                    <span className="status-ratio-number cancelled">{health.stats.cancelled}</span>
                    <span className="status-ratio-label">Cxl</span>
                  </div>
                  <div className="status-ratio-item expired">
                    <span className="status-ratio-number expired">{health.stats.expired}</span>
                    <span className="status-ratio-label">Exp</span>
                  </div>
                </div>
              ) : (
                <span className="text-tertiary text-xs">Loading breakdown...</span>
              )}
            </div>
          </div>
        </div>

        {/* Charts Container */}
        <div className="charts-row">
          <SVGChart 
            title="Wallet Top-Up Volume (USD)" 
            data={topupsTrend} 
            valueKey="amount" 
            prefix="$" 
          />
          <SVGChart 
            title="New Signups & Rentals" 
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

      <div className="wallet-grid mb-8">
        {/* User Balance Adjustment Panel */}
        <div className="glass-panel p-6 card-glow">
          <h2 className="section-title mt-0">Adjust User Balance</h2>
          <p className="topup-desc mb-6">Support tool to credit user accounts or correct wallet issues.</p>

          <form onSubmit={handleAdjustBalance}>
            <div className="topup-custom mb-4">
              <label htmlFor="user-select" className="input-label">Select User</label>
              <select
                id="user-select"
                className="input-field select-field"
                value={targetUserId}
                onChange={e => setTargetUserId(e.target.value)}
              >
                <option value="">-- Choose User --</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.email} (Current: ${Number(u.balance).toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div className="topup-custom mb-4">
              <label htmlFor="adjust-action" className="input-label">Action</label>
              <select
                id="adjust-action"
                className="input-field select-field"
                value={action}
                onChange={e => setAction(e.target.value as 'credit' | 'debit')}
              >
                <option value="credit">+ Credit (Add Funds)</option>
                <option value="debit">− Debit (Deduct Funds)</option>
              </select>
            </div>

            <div className="topup-custom mb-4">
              <label htmlFor="adjust-amount" className="input-label">Amount (USD)</label>
              <input
                type="number"
                id="adjust-amount"
                className="input-field"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
              />
            </div>

            <div className="topup-custom mb-6">
              <label htmlFor="adjust-reason" className="input-label">Reason / Description</label>
              <input
                type="text"
                id="adjust-reason"
                className="input-field"
                placeholder="e.g. Support compensation"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            {formError && <p className="error-message-inline mb-4">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {formError}
            </p>}
            {formSuccess && <p className="success-message-inline mb-4">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 4 }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {formSuccess}
            </p>}

            <button type="submit" className="btn btn-primary w-full" disabled={isAdjusting}>
              {isAdjusting ? 'Processing...' : (
                <>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', marginRight: 6 }}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  Execute Adjustment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Users list summary */}
        <div className="glass-panel p-6">
          <h2 className="section-title mt-0">Registered Users</h2>
          <div className="search-box mb-4">
            <input
              type="search"
              className="input-field"
              placeholder="Search user emails..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[350px] overflow-y-auto pr-1">
            <div className="table-container">
            <table className="data-table text-xs">

              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} className={targetUserId === u.id ? 'active-row' : ''} onClick={() => setTargetUserId(u.id)} style={{ cursor: 'pointer' }}>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge status-${u.role === 'admin' ? 'completed' : 'expired'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="font-semibold">${Number(u.balance).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {/* rentals list */}
      <div className="section-header">
        <h2 className="section-title">System Rentals</h2>
      </div>

      <div className="glass-panel rentals-table-wrapper">
        <div className="filters-row mb-4">
          <input
            type="search"
            className="input-field max-w-sm"
            placeholder="Search by phone, email, or service..."
            value={rentalSearch}
            onChange={e => setRentalSearch(e.target.value)}
          />
        </div>

        {filteredRentals.length === 0 ? (
          <p className="no-results text-center py-8">No rentals match your search criteria</p>
        ) : (
          <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Phone Number</th>
                <th>Price</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRentals.map((rental) => (
                <tr key={rental.id}>
                  <td className="font-semibold text-xs">{rental.user_email}</td>
                  <td>{rental.provider_name.split('|')[1]} ({rental.provider_name.split('|')[2]})</td>
                  <td className="number-cell font-mono">{rental.phone_number}</td>
                  <td>${Number(rental.price).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge status-${rental.status}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td><FormattedDate date={rental.created_at} type="date" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}
