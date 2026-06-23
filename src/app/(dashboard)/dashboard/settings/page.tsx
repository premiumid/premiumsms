'use client'

import { useState, useEffect, useRef, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'
import FormattedDate from '@/components/FormattedDate'

export default function SettingsPage() {
  const router = useRouter()
  const { success: toastSuccess } = useToast()
  const confirmRef = useRef<HTMLInputElement>(null)
  const [user, setUser] = useState<{ email: string; created_at: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetch('/api/account/profile')
      .then(r => r.json())
      .then(d => startTransition(() => setUser(d)))
      .catch(() => {})
      .finally(() => startTransition(() => setLoading(false)))
  }, [])

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete account')
      toastSuccess('Account deleted')
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setDeleting(false)
    }
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>

      <div className="settings-cards">
        {/* Profile Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 className="settings-card-title">Profile</h2>
          </div>
          {loading ? (
            <div className="settings-skeleton">
              <div className="settings-skeleton-line" style={{ width: '60%' }} />
              <div className="settings-skeleton-line" style={{ width: '40%' }} />
            </div>
          ) : user ? (
            <div className="settings-profile-rows">
              <div className="settings-profile-row">
                <span className="settings-profile-label">Email</span>
                <span className="settings-profile-value">{user.email}</span>
              </div>
              <div className="settings-profile-row">
                <span className="settings-profile-label">Joined</span>
                <span className="settings-profile-value"><FormattedDate date={user.created_at} /></span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Danger Zone */}
        <div className="settings-card settings-card--danger">
          <div className="settings-card-header">
            <div className="settings-card-icon settings-card-icon--danger">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h2 className="settings-card-title" style={{ color: 'var(--danger)' }}>Delete Account</h2>
          </div>
          <p className="settings-desc">
            Once deleted, your profile, wallet balance, rental history, and API keys are permanently removed. This cannot be undone.
          </p>
          {!confirming ? (
            <button className="settings-danger-btn" onClick={() => { setConfirming(true); setTimeout(() => confirmRef.current?.focus(), 50) }}>
              Delete Account
            </button>
          ) : (
            <div className="settings-confirm">
              <p className="settings-confirm-text" id="delete-confirm-desc">
                Type <strong>DELETE</strong> to confirm:
              </p>
              <label htmlFor="delete-confirm-input" className="sr-only">Type DELETE to confirm</label>
              <input
                ref={confirmRef}
                id="delete-confirm-input"
                className="settings-input"
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                aria-describedby="delete-confirm-desc"
              />
              <label htmlFor="delete-password-input" className="sr-only">Enter your password</label>
              <input
                id="delete-password-input"
                className="settings-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              {error && <p className="settings-error" role="alert">{error}</p>}
              <div className="settings-confirm-actions">
                <button
                  className="settings-danger-btn"
                  disabled={confirmText !== 'DELETE' || !password || deleting}
                  onClick={handleDelete}
                >
                  {deleting ? 'Deleting…' : 'Permanently Delete'}
                </button>
                <button
                  className="settings-cancel-btn"
                  onClick={() => { setConfirming(false); setConfirmText(''); setPassword(''); setError(null) }}
                  disabled={deleting}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
