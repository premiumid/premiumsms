'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FormattedDate from '@/components/FormattedDate'
import { useToast } from '@/components/Toast'

interface Message {
  id: string
  text: string
  code?: string
  received_at: string
}

interface Rental {
  id: string
  phone_number: string
  service_slug: string
  country_code: string
  status: string
  price: number
  expires_at: string
}

export default function RentalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { success: toastSuccess, error: toastError } = useToast()
  const [rental, setRental] = useState<Rental | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [copiedNum, setCopiedNum] = useState(false)
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null)

  // Fetch rental data
  async function fetchRental() {
    try {
      const res = await fetch(`/api/rentals/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRental(data.rental)
      setMessages(data.messages ?? [])
      return data.rental as Rental
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rental')
      return null
    } finally {
      setLoading(false)
    }
  }

  // Initial load — runs once
  useEffect(() => {
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchRental().then(r => {
      if (cancelled || !r) return
      if (r.status === 'active') {
        const expiresAt = new Date(r.expires_at).getTime()
        setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
      }
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Polling interval — separate from initial load
  useEffect(() => {
    const interval = setInterval(async () => {
      const r = await fetchRental()
      if (r && r.status !== 'active') {
        clearInterval(interval)
      }
    }, 5000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Countdown timer — ticks every second
  useEffect(() => {
    if (!rental || rental.status !== 'active') return
    const expiresAt = new Date(rental.expires_at).getTime()
    const tick = setInterval(() => {
      setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)))
    }, 1000)
    return () => clearInterval(tick)
  }, [rental])

  async function handleCancel() {
    if (!confirm('Cancel this rental? You will be refunded.')) return
    setCancelling(true)
    try {
      const res = await fetch(`/api/rentals/${id}`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await fetchRental()
      toastSuccess('Rental cancelled — refund issued')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to cancel')
      setError(err instanceof Error ? err.message : 'Failed to cancel')
    } finally {
      setCancelling(false)
    }
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

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

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="empty-state">
          <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="empty-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <p className="empty-title">Loading rental…</p>
        </div>
      </div>
    )
  }

  if (error || !rental) {
    return (
      <div className="dashboard-content">
        <div className="alert-error">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error ?? 'Rental not found'}
        </div>
        <button className="btn btn-secondary" onClick={() => router.back()}>← Go Back</button>
      </div>
    )
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => router.push('/dashboard/rentals')}>← My Rentals</button>
          <h1 className="page-title">SMS Inbox</h1>
        </div>
        <span className={`status-badge status-${rental.status}`}>{rental.status}</span>
      </div>

      {/* Number Card */}
      <div className="number-card glass-panel">
        <div className="number-display">
          <span className="number-label">Your Number</span>
          <span className="number-value">{rental.phone_number}</span>
          <button
            className="copy-btn"
            onClick={() => { navigator.clipboard.writeText(rental.phone_number); setCopiedNum(true); setTimeout(() => setCopiedNum(false), 2000); toastSuccess('Number copied') }}
            id="copy-number-btn"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            {copiedNum ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="number-meta">
          <div className="meta-item">
            <span className="meta-label">Service</span>
            <span className="meta-value">{displayService(rental.service_slug)}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Country</span>
            <span className="meta-value">{rental.country_code.toUpperCase()}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Cost</span>
            <span className="meta-value">${Number(rental.price).toFixed(2)}</span>
          </div>
          {rental.status === 'active' && (
            <div className="meta-item">
              <span className="meta-label">Expires in</span>
              <span className={`meta-value timer${timeLeft < 60 ? ' timer-urgent' : ''}`}>
                {minutes}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {rental.status === 'active' && (
          <button
            className="btn btn-cancel"
            onClick={handleCancel}
            disabled={cancelling}
            id="cancel-rental-btn"
          >
            {cancelling ? 'Cancelling…' : (
                <>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Cancel & Refund
                </>
              )}
          </button>
        )}
      </div>

      {/* SMS Inbox */}
      <div className="section-header section-header-spaced">
        <h2 className="section-title">Messages</h2>
        <div className="flex items-center" style={{ gap: '0.5rem' }}>
          {messages.length > 0 && (
            <button className="btn btn-secondary btn-small" onClick={() => {
              const blob = new Blob([JSON.stringify({ phone_number: rental?.phone_number, service: rental?.service_slug, messages }, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a'); a.href = url; a.download = `sms-${rental?.phone_number || 'export'}.json`; a.click()
              URL.revokeObjectURL(url)
            }}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export JSON
            </button>
          )}
          {rental.status === 'active' && (
            <span className="polling-badge">
              <span className="polling-dot" />
              Live polling every 5s
            </span>
          )}
        </div>
      </div>

      <div className="glass-panel sms-inbox">
        {messages.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              {rental.status === 'active' ? (
                <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ) : (
                <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
              )}
            </span>
            <p className="empty-title">
              {rental.status === 'active' ? 'Waiting for SMS…' : 'No messages received'}
            </p>
            {rental.status === 'active' && (
              <p className="empty-desc">Send the verification code to {rental.phone_number}</p>
            )}
          </div>
        ) : (
          <div className="sms-list">
            {messages.map(msg => (
              <div key={msg.id} className="sms-message animate-fade-in">
                <div className="sms-header">
                  <span className="sms-time"><FormattedDate date={msg.received_at} type="time" /></span>
                  {msg.code && (
                    <span className="sms-code">{msg.code}</span>
                  )}
                </div>
                <p className="sms-text">{msg.text}</p>
                {msg.code && (
                  <button
                    className="copy-code-btn"
                    onClick={() => { navigator.clipboard.writeText(msg.code!); setCopiedCodeId(msg.id); setTimeout(() => setCopiedCodeId(null), 2000); toastSuccess('Code copied') }}
                    id={`copy-code-${msg.id}`}
                  >
                    {copiedCodeId === msg.id ? '✓ Copied' : (
                      <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      Copy Code: <strong>{msg.code}</strong></>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
