'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FormattedDate from '@/components/FormattedDate'
import { useToast } from '@/components/Toast'
import EmptyState from '@/components/EmptyState'
import { createClient } from '@/lib/supabase/client'
import type { RealtimeChannel } from '@supabase/supabase-js'

interface Transaction {
  id: string
  type: 'topup' | 'debit' | 'refund' | 'admin_credit'
  amount: number
  balance_after: number
  description: string
  created_at: string
}

interface PaymentData {
  paymentId: string
  payAddress: string
  payAmount: number
  payCurrency: string
  priceAmount: number
}

interface WalletClientProps {
  initialBalance: number
  initialTransactions: Transaction[]
  userEmail: string
}

type PaymentStep = 'select' | 'awaiting' | 'success'
type PaymentStatus = 'waiting' | 'confirming' | 'confirmed' | 'finished' | 'failed' | 'expired' | 'partially_paid'

const STATUS_CONFIG: Record<string, { label: string; borderClass: string; textClass: string; bgClass: string; icon: 'waiting' | 'confirming' | 'confirmed' | 'partial' | 'failed' | 'expired' }> = {
  waiting:       { label: 'Awaiting your transfer…',            borderClass: 'border-amber-500', textClass: 'text-amber-500', bgClass: 'bg-amber-500', icon: 'waiting' },
  confirming:    { label: 'Detected! Awaiting confirmations…',  borderClass: 'border-blue-500', textClass: 'text-blue-500', bgClass: 'bg-blue-500', icon: 'confirming' },
  confirmed:     { label: 'Confirmed! Crediting wallet…',       borderClass: 'border-emerald-500', textClass: 'text-emerald-500', bgClass: 'bg-emerald-500', icon: 'confirmed' },
  finished:      { label: 'Payment complete!',                  borderClass: 'border-emerald-500', textClass: 'text-emerald-500', bgClass: 'bg-emerald-500', icon: 'confirmed' },
  partially_paid:{ label: 'Partial payment received…',          borderClass: 'border-amber-500', textClass: 'text-amber-500', bgClass: 'bg-amber-500', icon: 'partial' },
  failed:        { label: 'Payment failed',                     borderClass: 'border-red-500', textClass: 'text-red-500', bgClass: 'bg-red-500', icon: 'failed' },
  expired:       { label: 'Payment expired',                    borderClass: 'border-gray-500', textClass: 'text-gray-500', bgClass: 'bg-gray-500', icon: 'expired' },
}

function StatusIcon({ type }: { type: string }) {
  const props = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (type) {
    case 'waiting':
      return <svg aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'confirming':
      return <svg aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'confirmed':
      return <svg aria-hidden="true" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    case 'partial':
      return <svg aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    case 'failed':
      return <svg aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
    case 'expired':
      return <svg aria-hidden="true" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    default:
      return null
  }
}

const AMOUNT_PRESETS = [12, 20, 30, 50]

export default function WalletClient({ initialBalance, initialTransactions, userEmail }: WalletClientProps) {
  const router = useRouter()
  const { success: toastSuccess, error: toastError } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to top-up card when arriving via #topup-card hash
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash === '#topup-card') {
      const el = document.getElementById('topup-card')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const [selectedAmount, setSelectedAmount] = useState<number>(12)
  const [customAmount, setCustomAmount] = useState<string>('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('select')
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('waiting')
  const [copied, setCopied] = useState<'address' | 'amount' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(initialTransactions)
  const [txPage, setTxPage] = useState(1)
  const [txLoading, setTxLoading] = useState(false)
  const [txHasMore, setTxHasMore] = useState(initialTransactions.length >= 20)

  const activeChannelRef = useRef<RealtimeChannel | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  const finalAmount = customAmount ? Number(customAmount) : selectedAmount

  const totalSpent = useMemo(() =>
    allTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + tx.amount, 0),
    [allTransactions]
  )

  const lastActivity = useMemo(() => {
    if (allTransactions.length === 0) return null
    return allTransactions[0].created_at
  }, [allTransactions])

  const stopRealtimeSubscription = () => {
    if (activeChannelRef.current) {
      const supabase = createClient()
      supabase.removeChannel(activeChannelRef.current)
      activeChannelRef.current = null
    }
  }

  useEffect(() => {
    if (!isModalOpen) return
    prevFocusRef.current = document.activeElement as HTMLElement
    const modal = modalRef.current
    if (!modal) return
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    modal.addEventListener('keydown', handleKeyDown)
    return () => {
      modal.removeEventListener('keydown', handleKeyDown)
      prevFocusRef.current?.focus()
    }
  }, [isModalOpen])

  useEffect(() => () => stopRealtimeSubscription(), [])

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(0)
  }

  const copyToClipboard = async (text: string, type: 'address' | 'amount') => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const startRealtimeSubscription = (paymentId: string) => {
    stopRealtimeSubscription()
    const supabase = createClient()
    const channel = supabase
      .channel(`payment-status-${paymentId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'crypto_payments',
        filter: `nowpayments_id=eq.${paymentId}`
      }, (payload: { new: { status: string; processed?: boolean } }) => {
        const status = payload.new.status as PaymentStatus
        setPaymentStatus(status)
        const isComplete = status === 'finished' || status === 'confirmed' || payload.new.processed
        const isFailed = status === 'failed' || status === 'expired'
        if (isComplete) {
          stopRealtimeSubscription()
          setPaymentStep('success')
          toastSuccess('Payment credited to your wallet')
          router.refresh()
        } else if (isFailed) {
          stopRealtimeSubscription()
          setError(`Payment ${status}. Please close and try again.`)
        }
      })
      .subscribe()
    activeChannelRef.current = channel
  }

  const handleCreatePayment = async () => {
    if (finalAmount < 12 || isNaN(finalAmount)) {
      setError('Minimum top-up amount is $12.00 USD (USDT TRC-20)')
      return
    }
    setError(null)
    setIsCreatingPayment(true)
    setIsModalOpen(true)
    setPaymentStep('select')
    try {
      const res = await fetch('/api/wallet/topup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalAmount }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create payment')
      setPaymentData(data)
      setPaymentStatus('waiting')
      setPaymentStep('awaiting')
      startRealtimeSubscription(data.paymentId)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsModalOpen(false)
    } finally {
      setIsCreatingPayment(false)
    }
  }

  const handleCloseModal = () => {
    stopRealtimeSubscription()
    setIsModalOpen(false)
    setPaymentData(null)
    setPaymentStatus('waiting')
    setPaymentStep('select')
    setError(null)
  }

  const txMeta = (type: Transaction['type']) => {
    switch (type) {
      case 'topup':
      case 'admin_credit':
        return { icon: '↓', label: 'Credit', className: 'tx-credit' }
      case 'debit':
        return { icon: '↑', label: 'Debit', className: 'tx-debit' }
      case 'refund':
        return { icon: '↻', label: 'Refund', className: 'tx-refund' }
    }
  }

  const loadMoreTransactions = async () => {
    setTxLoading(true)
    try {
      const nextPage = txPage + 1
      const res = await fetch(`/api/wallet/transactions?page=${nextPage}&limit=20`)
      const data = await res.json()
      if (data.transactions?.length > 0) {
        setAllTransactions(prev => [...prev, ...data.transactions])
        setTxPage(nextPage)
        setTxHasMore(data.transactions.length >= 20)
      } else {
        setTxHasMore(false)
      }
    } catch {
      toastError('Failed to load more transactions')
    } finally {
      setTxLoading(false)
    }
  }

  const statusCfg = STATUS_CONFIG[paymentStatus] || STATUS_CONFIG.waiting
  const validAmount = finalAmount > 0 && !isNaN(finalAmount)

  return (
    <div className="wallet-page">
      {/* ── Header ── */}
      <div className="wallet-page-header">
        <div>
          <h1 className="wallet-page-title">Wallet</h1>
          <p className="wallet-page-subtitle">Manage your funds and view transaction history</p>
        </div>
      </div>

      <div className="wallet-grid">
        {/* ── Balance Card ── */}
        <div className="wallet-balance-card">
          <div className="wallet-balance-glow" />
          <div className="wallet-balance-body">
            <div className="wallet-balance-top">
              <div className="wallet-balance-icon">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <span className="wallet-balance-label">Current Balance</span>
            </div>
            <div className="wallet-balance-amount-row">
              <span className="wallet-balance-currency">$</span>
              <span className="wallet-balance-amount">{initialBalance.toFixed(2)}</span>
              <span className="wallet-balance-ccy">USD</span>
            </div>
            <div className="wallet-balance-stats">
              <div className="wallet-balance-stat">
                <span className="wallet-balance-stat-value">${totalSpent.toFixed(2)}</span>
                <span className="wallet-balance-stat-label">Total Spent</span>
              </div>
              <div className="wallet-balance-stat-divider" />
              <div className="wallet-balance-stat">
                <span className="wallet-balance-stat-value">
                  {lastActivity ? <FormattedDate date={lastActivity} /> : '—'}
                </span>
                <span className="wallet-balance-stat-label">Last Activity</span>
              </div>
            </div>
            <div className="wallet-balance-footer">
              <span className="wallet-balance-email">{userEmail}</span>
              <div className="wallet-balance-actions">
                <button className="wallet-balance-btn" onClick={() => document.getElementById('topup-card')?.scrollIntoView({ behavior: 'smooth' })}>
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Top Up
                </button>
                <Link href="/dashboard/api" className="wallet-balance-btn">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                  API
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Top-up Card ── */}
        <div className="wallet-card wallet-topup-card" id="topup-card">
          <div className="wallet-topup-header">
            <h2 className="wallet-topup-title">Top Up Wallet</h2>
            <p className="wallet-topup-subtitle">Pay with USDT (TRC-20) · Minimum $12.00 USD</p>
          </div>

          <div className="wallet-topup-amounts">
            <div className="wallet-topup-grid">
              {AMOUNT_PRESETS.map((amt) => (
                <button
                  key={amt}
                  id={`amount-btn-${amt}`}
                  className={`wallet-topup-preset ${selectedAmount === amt && !customAmount ? 'active' : ''}`}
                  onClick={() => handleAmountSelect(amt)}
                  aria-pressed={selectedAmount === amt && !customAmount ? 'true' : 'false'}
                >
                  ${amt}
                </button>
              ))}
            </div>
            <div className="wallet-topup-custom">
              <span className="wallet-topup-custom-prefix" aria-hidden="true">$</span>
              <label htmlFor="custom-amount-input" className="sr-only">Custom amount</label>
              <input
                id="custom-amount-input"
                className="wallet-topup-input"
                type="number"
                min="1"
                step="0.01"
                placeholder="Custom amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
              />
            </div>
          </div>

          {error && <div className="wallet-error">{error}</div>}

          <button
            id="topup-submit-btn"
            className="wallet-topup-btn btn-primary"
            onClick={handleCreatePayment}
            disabled={isCreatingPayment || finalAmount < 12}
          >
            {isCreatingPayment ? (
              <>
                <span className="spinner-sm" />
                Generating invoice…
              </>
            ) : (
              <>
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                {validAmount ? `Top Up $${finalAmount.toFixed(2)}` : 'Select Amount'}
              </>
            )}
          </button>

          <div className="wallet-topup-divider">
            <span className="wallet-topup-divider-text">More payment methods</span>
          </div>

          <div className="wallet-topup-options">
            <div className="wallet-topup-option active">
              <div className="wallet-topup-option-icon wallet-topup-option-icon--usdt">
                <span className="wallet-topup-option-icon-text">$</span>
              </div>
              <div className="wallet-topup-option-info">
                <span className="wallet-topup-option-name">USDT (TRC-20)</span>
                <span className="wallet-topup-option-desc">Instant · Low fees</span>
              </div>
              <span className="wallet-topup-option-check">✓</span>
            </div>
            <div className="wallet-topup-option disabled">
              <div className="wallet-topup-option-icon">
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <div className="wallet-topup-option-info">
                <span className="wallet-topup-option-name">Credit / Debit Card</span>
                <span className="wallet-topup-option-desc">Coming soon</span>
              </div>
              <span className="wallet-topup-option-badge">Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="wallet-tx-section">
        <div className="wallet-tx-header">
          <h2 className="wallet-tx-title">Transaction History</h2>
          {allTransactions.length > 0 && (
            <span className="wallet-tx-count">{allTransactions.length} transaction{allTransactions.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {loading && allTransactions.length === 0 ? (
          <div className="wallet-tx-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="wallet-tx-skeleton">
                <div className="wallet-tx-skeleton-icon" />
                <div className="wallet-tx-skeleton-lines">
                  <div className="wallet-tx-skeleton-line wallet-tx-skeleton-line--short" />
                  <div className="wallet-tx-skeleton-line wallet-tx-skeleton-line--long" />
                </div>
                <div className="wallet-tx-skeleton-right">
                  <div className="wallet-tx-skeleton-line wallet-tx-skeleton-line--amount" />
                  <div className="wallet-tx-skeleton-line wallet-tx-skeleton-line--balance" />
                </div>
              </div>
            ))}
          </div>
        ) : allTransactions.length === 0 ? (
          <div className="wallet-tx-empty">
            <EmptyState
              icon={<svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
              title="No transactions yet"
              description="Top up your wallet to get started"
            />
          </div>
        ) : (
          <div className="wallet-tx-list">
            {allTransactions.map((tx) => {
              const meta = txMeta(tx.type)
              return (
                <div key={tx.id} className="wallet-tx-item">
                  <div className={`wallet-tx-icon ${meta.className}`}>
                    <span aria-hidden="true">{meta.icon}</span>
                  </div>
                  <div className="wallet-tx-info">
                    <p className="wallet-tx-desc">{tx.description}</p>
                    <p className="wallet-tx-date">
                      <FormattedDate date={tx.created_at} />
                    </p>
                  </div>
                  <div className={`wallet-tx-amount ${tx.type === 'topup' || tx.type === 'admin_credit' || tx.type === 'refund' ? 'wallet-tx-amount--positive' : ''}`}>
                    {tx.type === 'debit' ? '−' : '+'}${tx.amount.toFixed(2)}
                  </div>
                  <div className="wallet-tx-balance">
                    ${tx.balance_after.toFixed(2)}
                  </div>
                </div>
              )
            })}
            {txHasMore && (
              <div className="wallet-tx-loadmore">
                <button className="btn btn-secondary" onClick={loadMoreTransactions} disabled={txLoading}>
                  {txLoading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Payment Modal ── */}
      {isModalOpen && (
        <div className="wallet-modal-overlay" ref={modalRef} onClick={paymentStep === 'success' ? handleCloseModal : undefined} role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" tabIndex={-1}>
          <div className="wallet-modal-box" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') handleCloseModal() }}>

            {/* Step indicator */}
            <div className="wallet-modal-steps">
              <div className={`wallet-modal-step ${paymentStep === 'select' && !isCreatingPayment ? 'active' : paymentStep !== 'select' ? 'done' : ''}`}>
                <div className="wallet-modal-step-num">{paymentStep !== 'select' ? '✓' : '1'}</div>
                <span className="wallet-modal-step-label">Amount</span>
              </div>
              <div className="wallet-modal-step-line" />
              <div className={`wallet-modal-step ${paymentStep === 'awaiting' ? 'active' : paymentStep === 'success' ? 'done' : ''}`}>
                <div className="wallet-modal-step-num">{paymentStep === 'success' ? '✓' : '2'}</div>
                <span className="wallet-modal-step-label">Payment</span>
              </div>
              <div className="wallet-modal-step-line" />
              <div className={`wallet-modal-step ${paymentStep === 'success' ? 'done' : ''}`}>
                <div className="wallet-modal-step-num">3</div>
                <span className="wallet-modal-step-label">Confirm</span>
              </div>
            </div>

            {/* STEP: Creating payment */}
            {paymentStep === 'select' && isCreatingPayment && (
              <div className="wallet-modal-loading">
                <div className="spinner-lg" />
                <p>Generating invoice…</p>
                <p className="wallet-modal-sub">Connecting to payment provider</p>
              </div>
            )}

            {/* STEP: Awaiting payment */}
            {paymentStep === 'awaiting' && paymentData && (
              <>
                <div className="wallet-modal-header">
                  <h3 id="payment-modal-title">Complete Payment</h3>
                  <button className="wallet-modal-close" onClick={handleCloseModal} aria-label="Close modal">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <div className={`wallet-modal-status ${statusCfg.borderClass}`}>
                  <StatusIcon type={statusCfg.icon} />
                  <span className={statusCfg.textClass}>{statusCfg.label}</span>
                  {(paymentStatus === 'waiting' || paymentStatus === 'confirming') && (
                    <span className="wallet-modal-status-pulse" />
                  )}
                </div>

                <div className="wallet-modal-qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentData.payAddress)}&color=4f46e5&bgcolor=f8fafc`}
                    alt="USDT TRC-20 Deposit QR"
                    width={150}
                    height={150}
                  />
                  <span className="wallet-modal-qr-label">Scan to Deposit</span>
                </div>

                <div className="wallet-modal-info">
                  <div className="wallet-modal-info-row">
                    <span className="wallet-modal-info-label">Send exactly this amount</span>
                    <div className="wallet-modal-info-field">
                      <span className="wallet-modal-info-value">{paymentData.payAmount} <span className="wallet-modal-info-tag">USDT TRC-20</span></span>
                      <button className="wallet-modal-copy" onClick={() => copyToClipboard(String(paymentData.payAmount), 'amount')}>
                        {copied === 'amount' ? (
                          <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Copied</>
                        ) : (
                          <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="wallet-modal-info-row">
                    <span className="wallet-modal-info-label">To this wallet address</span>
                    <div className="wallet-modal-info-field wallet-modal-info-field--address">
                      <span className="wallet-modal-info-address">{paymentData.payAddress}</span>
                      <button className="wallet-modal-copy" onClick={() => copyToClipboard(paymentData.payAddress, 'address')}>
                        {copied === 'address' ? (
                          <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Copied</>
                        ) : (
                          <><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="wallet-modal-warning">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <div>
                    <strong>Send only USDT on the TRC-20 (Tron) network.</strong><br />
                    Other networks or coins will result in permanent loss of funds.
                  </div>
                </div>

                <div className="wallet-modal-footer">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Monitoring blockchain in real-time
                  <span className="wallet-modal-footer-id">ID: <code>{paymentData.paymentId}</code></span>
                </div>

                {error && <div className="wallet-error">{error}</div>}
              </>
            )}

            {/* STEP: Success */}
            {paymentStep === 'success' && (
              <div className="wallet-modal-success">
                <div className="wallet-modal-success-icon">
                  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3>Payment Confirmed!</h3>
                <p className="wallet-modal-success-amount">
                  <strong>${paymentData?.priceAmount.toFixed(2)}</strong> credited to your wallet
                </p>
                <p className="wallet-modal-sub">Your balance has been updated.</p>
                <div className="wallet-success-actions">
                  <button type="button" id="success-close-btn" className="btn btn-secondary" onClick={handleCloseModal}>
                    Stay Here
                  </button>
                  <button type="button" className="btn btn-primary" onClick={() => router.push('/dashboard')}>
                    Order a Number →
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
