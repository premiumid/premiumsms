'use client'

import { useState } from 'react'
import { resendVerification } from '../(auth)/actions'
import Link from 'next/link'

export default function ResendVerificationPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleResend() {
    setLoading(true)
    setError(null)
    const result = await resendVerification()
    if (result?.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
      <div className="glass-panel" style={{ maxWidth: 420, width: '100%', padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Verify Your Email</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
          {sent
            ? 'Verification email sent! Check your inbox and spam folder.'
            : 'Click the button below to receive a new verification email.'}
        </p>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>
        )}

        {sent ? (
          <Link href="/login" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Go to Login
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={handleResend} disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? 'Sending…' : 'Resend Verification Email'}
          </button>
        )}
      </div>
    </div>
  )
}
