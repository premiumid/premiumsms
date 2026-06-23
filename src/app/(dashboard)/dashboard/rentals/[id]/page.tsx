'use client'

import { useState, useEffect, startTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FormattedDate from '@/components/FormattedDate'
import { useToast } from '@/components/Toast'
import { createClient } from '@/lib/supabase/client'

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

  function playChime() {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AC) return
      const ctx = new AC()
      const t = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const g1 = ctx.createGain(); const g2 = ctx.createGain()
      osc1.type = 'sine'; osc2.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, t)
      osc2.frequency.setValueAtTime(659.25, t + 0.15)
      g1.gain.setValueAtTime(0.12, t); g1.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
      g2.gain.setValueAtTime(0.12, t + 0.15); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
      osc1.connect(g1); g1.connect(ctx.destination); osc1.start(t); osc1.stop(t + 0.4)
      osc2.connect(g2); g2.connect(ctx.destination); osc2.start(t + 0.15); osc2.stop(t + 0.55)
    } catch { /* ignore */ }
  }

  async function fetchRental() {
    try {
      const res = await fetch(`/api/rentals/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      startTransition(() => {
        setRental(data.rental)
        setMessages(data.messages ?? [])
      })
      return data.rental as Rental
    } catch (err) {
      startTransition(() => setError(err instanceof Error ? err.message : 'Failed to load rental'))
      return null
    } finally {
      startTransition(() => setLoading(false))
    }
  }

  useEffect(() => {
    let cancelled = false
    void fetchRental().then(r => {
      if (cancelled || !r) return
      if (r.status === 'active') {
        startTransition(() => {
          setTimeLeft(Math.max(0, Math.floor((new Date(r.expires_at).getTime() - Date.now()) / 1000)))
        })
      }
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    const smsChannel = supabase
      .channel(`sms-messages-${id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'sms_messages', filter: `rental_id=eq.${id}`
      }, (payload) => {
        const newMsg = payload.new as Message
        setMessages(prev => [newMsg, ...prev])
        playChime()
        toastSuccess('New SMS received!')
      })
      .subscribe()
    const rentalChannel = supabase
      .channel(`rental-status-${id}`)
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'rentals', filter: `id=eq.${id}`
      }, (payload) => setRental(payload.new as Rental))
      .subscribe()
    return () => {
      supabase.removeChannel(smsChannel)
      supabase.removeChannel(rentalChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!rental || rental.status !== 'active') return
    const expiresAt = new Date(rental.expires_at).getTime()
    const tick = setInterval(() => setTimeLeft(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))), 1000)
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

  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="empty-state">
          <div className="spinner-lg" />
          <p className="empty-title">Loading rental…</p>
        </div>
      </div>
    )
  }

  if (error || !rental) {
    return (
      <div className="dashboard-content">
        <div className="alert-error">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error ?? 'Rental not found'}
        </div>
        <button className="btn btn-secondary" onClick={() => router.back()}>← Go Back</button>
      </div>
    )
  }

  return (
    <div className="detail-page">
      {/* Back */}
      <button className="detail-back" onClick={() => router.push('/dashboard/rentals')}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        My Rentals
      </button>

      {/* Header */}
      <div className="detail-header">
        <h1 className="detail-title">{displayService(rental.service_slug)} SMS Inbox</h1>
        <span className={`rentals-badge rentals-badge--${rental.status}`}>{STATUS_LABELS[rental.status] || rental.status}</span>
      </div>

      {/* Number Card */}
      <div className="detail-number-card">
        <div className="detail-number-card-bg" />

        <div className="detail-number-body">
          <div className="detail-number-top">
            <div className="detail-number-label">Your Number</div>
            <div className="detail-number-value-row">
              <span className="detail-number-value">{rental.phone_number}</span>
              <button
                className="detail-number-copy"
                onClick={() => { navigator.clipboard.writeText(rental.phone_number); setCopiedNum(true); setTimeout(() => setCopiedNum(false), 2000); toastSuccess('Number copied') }}
              >
                {copiedNum ? (
                  <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Copied</>
                ) : (
                  <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                )}
              </button>
            </div>
          </div>

          <div className="detail-number-meta">
            <div className="detail-number-meta-item">
              <span className="detail-number-meta-label">Service</span>
              <span className="detail-number-meta-value">{displayService(rental.service_slug)}</span>
            </div>
            <div className="detail-number-meta-item">
              <span className="detail-number-meta-label">Country</span>
              <span className="detail-number-meta-value">{rental.country_code.toUpperCase()}</span>
            </div>
            <div className="detail-number-meta-item">
              <span className="detail-number-meta-label">Cost</span>
              <span className="detail-number-meta-value">${Number(rental.price).toFixed(2)}</span>
            </div>
            {rental.status === 'active' && (
              <div className="detail-number-meta-item">
                <span className="detail-number-meta-label">Expires in</span>
                <span className={`detail-number-meta-value detail-timer${timeLeft < 60 ? ' detail-timer--urgent' : ''}`}>
                  {minutes}:{String(seconds).padStart(2, '0')}
                </span>
              </div>
            )}
          </div>

          {rental.status === 'active' && (
            <button className="detail-cancel" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling…' : (
                <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Cancel & Refund</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="detail-messages-section">
        <div className="detail-messages-header">
          <h2 className="detail-messages-title">Messages</h2>
          <div className="detail-messages-actions">
            {messages.length > 0 && (
              <button className="detail-export-btn" onClick={() => {
                const blob = new Blob([JSON.stringify({ phone_number: rental?.phone_number, service: rental?.service_slug, messages }, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a'); a.href = url; a.download = `sms-${rental?.phone_number || 'export'}.json`; a.click()
                URL.revokeObjectURL(url)
              }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Export JSON
              </button>
            )}
            {rental.status === 'active' && (
              <span className="detail-live-badge">
                <span className="detail-live-dot" />
                Live
              </span>
            )}
          </div>
        </div>

        <div className="detail-messages-list" aria-live="polite" aria-atomic="false">
          {messages.length === 0 ? (
            <div className="detail-messages-empty">
              <svg width="40" height="40" fill="none" stroke="var(--text-faint)" strokeWidth="1.5" viewBox="0 0 24 24">
                {rental.status === 'active' ? (
                  <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>
                ) : (
                  <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></>
                )}
              </svg>
              <p className="detail-messages-empty-title">
                {rental.status === 'active' ? 'Waiting for SMS…' : 'No messages received'}
              </p>
              {rental.status === 'active' && (
                <p className="detail-messages-empty-desc">Send the verification code to {rental.phone_number}</p>
              )}
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={msg.id} className={`detail-message`} style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="detail-message-time">
                  <FormattedDate date={msg.received_at} type="time" />
                </div>
                {msg.code && (
                  <div className="detail-message-code">{msg.code}</div>
                )}
                <p className="detail-message-text">{msg.text}</p>
                {msg.code && (
                  <button
                    className="detail-message-copy"
                    onClick={() => { navigator.clipboard.writeText(msg.code!); setCopiedCodeId(msg.id); setTimeout(() => setCopiedCodeId(null), 2000); toastSuccess('Code copied') }}
                  >
                    {copiedCodeId === msg.id ? '✓ Copied' : 'Copy Code'}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
