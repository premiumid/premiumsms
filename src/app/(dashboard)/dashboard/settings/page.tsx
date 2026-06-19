'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/Toast'
import FormattedDate from '@/components/FormattedDate'

export default function SettingsPage() {
  const router = useRouter()
  const { success: toastSuccess } = useToast()
  const [user, setUser] = useState<{ email: string; created_at: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  useEffect(() => {
    fetch('/api/account/profile')
      .then(r => r.json())
      .then(d => setUser(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete() {
    setDeleting(true)
    setError(null)

    try {
      const res = await fetch('/api/account/delete', { method: 'POST' })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete account')
      }

      toastSuccess('Account deleted successfully')
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

      {/* Profile Info */}
      <div className="glass-panel p-6" style={{ maxWidth: 560, marginBottom: '1.5rem' }}>
        <h2 className="text-sm font-bold mb-4" style={{ fontSize: '1.125rem' }}>
          Profile
        </h2>
        {loading ? (
          <div>
            <div className="skeleton-line" style={{ width: '60%', height: 16, marginBottom: 8 }} />
            <div className="skeleton-line" style={{ width: '40%', height: 14 }} />
          </div>
        ) : user ? (
          <div className="flex flex-col" style={{ gap: '0.75rem', fontSize: '0.875rem' }}>
            <div>
              <span className="font-semibold text-tertiary" style={{ marginRight: '0.5rem' }}>Email</span>
              <span>{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-tertiary" style={{ marginRight: '0.5rem' }}>Joined</span>
              <span><FormattedDate date={user.created_at} /></span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Danger Zone */}
      <div className="glass-panel p-6" style={{ maxWidth: 560, borderColor: '#fecaca' }}>
        <h2 className="font-bold mb-2" style={{ fontSize: '1.125rem', color: '#dc2626' }}>
          Delete Account
        </h2>
        <p className="text-sm text-secondary mb-6" style={{ lineHeight: 1.6 }}>
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
          <div className="flex flex-col" style={{ gap: '1rem' }}>
            <p className="font-semibold text-sm">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="input-field"
            />
            {error && (
              <p className="text-xs" style={{ color: '#dc2626' }}>{error}</p>
            )}
            <div className="flex" style={{ gap: '0.75rem' }}>
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
