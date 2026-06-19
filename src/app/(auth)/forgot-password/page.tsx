'use client'

import Link from 'next/link'
import { useState } from 'react'
import { requestPasswordReset } from '../actions'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSent(false)
    const result = await requestPasswordReset(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="container auth-wrapper">
      <div className="glass-panel animate-fade-in auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Reset Password</h1>
          <p className="auth-subtitle">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              If an account with that email exists, you&apos;ll receive a password reset link shortly.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="auth-error">{error}</div>
            )}

            <form action={handleSubmit} className="grid">
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className="btn btn-primary auth-btn-container" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          Remember your password? <Link href="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
