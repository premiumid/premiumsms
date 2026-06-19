'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

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

      <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: 560 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Delete Account
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          Once you delete your account, all your data will be permanently removed.
          This includes your profile, wallet balance, rental history, and API keys.
          This action cannot be undone.
        </p>

        {!confirming ? (
          <button
            className="btn"
            style={{ background: '#dc2626', color: 'white' }}
            onClick={() => setConfirming(true)}
          >
            Delete Account
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              style={{
                width: '100%', padding: '0.625rem 1rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none'
              }}
            />
            {error && (
              <p style={{ fontSize: '0.8125rem', color: '#dc2626' }}>{error}</p>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn"
                style={{ background: '#dc2626', color: 'white' }}
                disabled={confirmText !== 'DELETE' || deleting}
                onClick={handleDelete}
              >
                {deleting ? 'Deleting…' : 'Permanently Delete My Account'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => { setConfirming(false); setConfirmText(''); setError(null) }}
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
