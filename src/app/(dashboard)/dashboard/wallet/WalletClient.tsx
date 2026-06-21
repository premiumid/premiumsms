'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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

export default function WalletClient({ initialBalance, initialTransactions, userEmail }: WalletClientProps) {
  const router = useRouter()
  const { success: toastSuccess, error: toastError } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const [selectedAmount, setSelectedAmount] = useState<number>(15)
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

  const stopRealtimeSubscription = () => {
    if (activeChannelRef.current) {
      const supabase = createClient()
      supabase.removeChannel(activeChannelRef.current)
      activeChannelRef.current = null
    }
  }

  // Focus trap for payment modal
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
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    modal.addEventListener('keydown', handleKeyDown)
    return () => {
      modal.removeEventListener('keydown', handleKeyDown)
      prevFocusRef.current?.focus()
    }
  }, [isModalOpen])

  // Cleanup on unmount
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

  const txIcon = (type: Transaction['type']) => {
    if (type === 'topup' || type === 'admin_credit') return '↓'
    return '↑'
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

  return (
    <div className="wallet-container">
      <div className="wallet-grid">

        {/* Balance Card */}
        <div className="balance-card glass-panel card-glow">
          <div className="balance-card-header">
            <span className="balance-card-icon">
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </span>
            <p className="balance-card-label">Current Balance</p>
          </div>
          <p className="balance-card-amount">${initialBalance.toFixed(2)}</p>
          <p className="balance-card-sub">USD</p>
          <p className="balance-card-email">{userEmail}</p>
        </div>

        {/* Top-up Card */}
        <div className="topup-card glass-panel">
          <h2 className="topup-title">Top Up Wallet</h2>
          <p className="topup-subtitle">Pay with USDT (TRC-20) · Minimum $12.00 USD</p>

          {/* Quick amounts */}
          <div className="amount-grid">
            {[15, 20, 30, 50].map((amt) => (
              <button
                key={amt}
                id={`amount-btn-${amt}`}
                className={`amount-btn ${selectedAmount === amt && !customAmount ? 'active' : ''}`}
                onClick={() => handleAmountSelect(amt)}
              >
                ${amt}
              </button>
            ))}
          </div>

          <input
            id="custom-amount-input"
            className="custom-amount-input"
            type="number"
            min="1"
            step="0.01"
            placeholder="Custom amount (USD)"
            value={customAmount}
            onChange={handleCustomAmountChange}
          />

          {error && <p className="wallet-error">{error}</p>}

          <button
            id="topup-submit-btn"
            className="topup-btn btn-primary"
            onClick={handleCreatePayment}
            disabled={isCreatingPayment || finalAmount < 12}
          >
            {isCreatingPayment ? (
              <span className="btn-loading"><span className="spinner-sm" /> Generating invoice…</span>
            ) : (
              `Top Up $${finalAmount > 0 ? finalAmount.toFixed(2) : '0.00'}`
            )}
          </button>

          {/* Coming soon: Card payments */}
          <div className="payment-coming-soon">
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Credit / Debit Card</span>
            <span className="badge-soon">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="tx-section glass-panel">
        <h2 className="tx-title">Transaction History</h2>
        {loading && allTransactions.length === 0 ? (
          <div className="tx-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="tx-row opacity-40">
                <div className="skeleton-circle" />
                <div className="tx-info">
                  <div className="skeleton-line" style={{ width: '60%', height: '14px', marginBottom: '6px' }} />
                  <div className="skeleton-line" style={{ width: '40%', height: '12px' }} />
                </div>
                <div className="tx-amounts">
                  <div className="skeleton-line" style={{ width: '70px', height: '16px', marginBottom: '4px', marginLeft: 'auto' }} />
                  <div className="skeleton-line" style={{ width: '90px', height: '12px', marginLeft: 'auto' }} />
                </div>
              </div>
            ))}
          </div>
        ) : allTransactions.length === 0 ? (
          <EmptyState
            icon={<svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}
            title="No transactions yet"
            description="Top up your wallet to get started"
          />
        ) : (
          <div className="tx-list">
            {allTransactions.map((tx) => (
              <div key={tx.id} className="tx-row">
                <div className={`tx-icon ${tx.type === 'topup' || tx.type === 'admin_credit' ? 'text-success' : 'text-danger'}`}>
                  {txIcon(tx.type)}
                </div>
                <div className="tx-info">
                  <p className="tx-desc">{tx.description}</p>
                  <p className="tx-date">
                    <FormattedDate date={tx.created_at} />
                  </p>
                </div>
                <div className="tx-amounts">
                  <p className={`tx-amount ${tx.type === 'topup' || tx.type === 'admin_credit' ? 'text-success' : 'text-danger'}`}>
                    {tx.type === 'debit' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="tx-balance">Balance: ${tx.balance_after.toFixed(2)}</p>
                </div>
              </div>
            ))}
            {txHasMore && (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }} onClick={loadMoreTransactions} disabled={txLoading}>
                  {txLoading ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Payment Modal ── */}
      {isModalOpen && (
        <div className="modal-overlay" ref={modalRef} onClick={paymentStep === 'success' ? handleCloseModal : undefined} role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={(e) => { if (e.key === 'Escape') handleCloseModal() }}>
          <div className="modal-box glass-panel" onClick={(e) => e.stopPropagation()}>

            {/* STEP: Creating payment */}
            {paymentStep === 'select' && isCreatingPayment && (
              <div className="modal-loading">
                <div className="spinner-lg" />
                <p>Generating your payment invoice…</p>
                <p className="modal-sub">Connecting to payment provider</p>
              </div>
            )}

            {/* STEP: Awaiting payment */}
            {paymentStep === 'awaiting' && paymentData && (
              <>
                <div className="modal-header">
                  <h3>Send USDT (TRC-20)</h3>
                  <button className="modal-close" onClick={handleCloseModal} aria-label="Close modal">
                    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>

                <div className={`payment-status-badge ${statusCfg.borderClass}`}>
                  <StatusIcon type={statusCfg.icon} />
                  <span className={statusCfg.textClass}>{statusCfg.label}</span>
                  {(paymentStatus === 'waiting' || paymentStatus === 'confirming') && (
                    <span className={`status-pulse ${statusCfg.bgClass}`} />
                  )}
                </div>

                <div className="qr-section">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(paymentData.payAddress)}&color=4f46e5&bgcolor=f8fafc`}
                    alt="USDT TRC-20 Deposit QR"
                    width={150}
                    height={150}
                    className="rounded-lg shadow-sm"
                  />
                  <span className="qr-label">Scan to Deposit</span>
                </div>

                <div className="payment-info-box">
                  <p className="payment-info-label">Send exactly this amount:</p>
                  <div className="copy-row">
                    <span className="payment-usdt-amount">
                      {paymentData.payAmount} <span className="currency-tag">USDT TRC-20</span>
                    </span>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(String(paymentData.payAmount), 'amount')}
                    >
                      {copied === 'amount' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="payment-info-box">
                  <p className="payment-info-label">To this wallet address:</p>
                  <div className="copy-row">
                    <span className="payment-address">{paymentData.payAddress}</span>
                    <button
                      className="copy-btn"
                      onClick={() => copyToClipboard(paymentData.payAddress, 'address')}
                    >
                      {copied === 'address' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="payment-warning">
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  Send <strong>only USDT on the TRC-20 (Tron) network</strong>. Other networks or
                  coins will result in permanent loss of funds.
                </div>

                <p className="payment-tracking">
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Monitoring blockchain in real-time · Payment ID: <code>{paymentData.paymentId}</code>
                </p>

                {error && <p className="wallet-error">{error}</p>}
              </>
            )}

            {/* STEP: Success */}
            {paymentStep === 'success' && (
              <div className="modal-success">
                <div className="success-icon">
                  <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3>Payment Confirmed!</h3>
                <p>
                  <strong>${paymentData?.priceAmount.toFixed(2)}</strong> has been credited to
                  your wallet.
                </p>
                <p className="modal-sub">Your balance has been updated.</p>
                <button id="success-close-btn" className="topup-btn btn-primary" onClick={handleCloseModal}>
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
