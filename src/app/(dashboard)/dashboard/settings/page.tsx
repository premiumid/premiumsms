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
      <div className="glass-panel p-6 max-w-[560px] mb-6">
        <h2 className="text-lg font-bold mb-4">
          Profile
        </h2>
        {loading ? (
          <div>
            <div className="skeleton-line w-[60%] h-4 mb-2" />
            <div className="skeleton-line w-[40%] h-3.5" />
          </div>
        ) : user ? (
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <span className="font-semibold text-tertiary mr-2">Email</span>
              <span>{user.email}</span>
            </div>
            <div>
              <span className="font-semibold text-tertiary mr-2">Joined</span>
              <span><FormattedDate date={user.created_at} /></span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Danger Zone */}
      <div className="glass-panel p-6 max-w-[560px]" style={{ borderColor: 'rgba(var(--danger-r), var(--danger-g), var(--danger-b), 0.2)' }}>
        <h2 className="font-bold mb-2 text-lg text-danger">
          Delete Account
        </h2>
        <p className="text-sm text-secondary mb-6 leading-relaxed">
          Once you delete your account, all your data will be permanently removed.
          This includes your profile, wallet balance, rental history, and API keys.
          This action cannot be undone.
        </p>

        {!confirming ? (
          <button
            className="btn"
            style={{ background: 'var(--danger)', color: 'white' }}
            onClick={() => setConfirming(true)}
          >
            Delete Account
          </button>
        ) : (
          <div className="flex flex-col gap-4">
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
              <p className="text-xs text-danger">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                className="btn"
                style={{ background: 'var(--danger)', color: 'white' }}
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
