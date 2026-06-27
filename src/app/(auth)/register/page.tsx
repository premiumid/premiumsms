'use client'

import Link from 'next/link'
import { useState } from 'react'
import { signup } from '../actions'

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [confirmValue, setConfirmValue] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  function getStrength(pw: string): { score: number; label: string; color: string } {
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^a-zA-Z0-9]/.test(pw)) score++
    const map = [
      { label: 'Weak', color: 'var(--danger)' },
      { label: 'Fair', color: 'var(--warning)' },
      { label: 'Good', color: 'var(--success)' },
      { label: 'Strong', color: 'var(--success)' },
      { label: 'Very Strong', color: '#047857' },
    ]
    return { score, ...map[Math.min(score, 4)] }
  }

  const strength = getStrength(passwordValue)
  const passwordsMatch = confirmValue === '' || passwordValue === confirmValue

  async function handleSubmit(formData: FormData) {
    if (passwordValue !== confirmValue) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)
    const result = await signup(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  // Build FormData from controlled inputs
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData()
    formData.set('email', (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value)
    formData.set('password', passwordValue)
    await handleSubmit(formData)
  }

  return (
    <div className="container auth-wrapper">
      <div className="glass-panel animate-fade-in auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Get started with PremiumID</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="grid">
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

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <div className="input-password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              required
              minLength={6}
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(o => !o)}
              className="password-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
            </div>
            {passwordValue && (
              <div className="password-strength" role="status" aria-live="polite" data-strength={strength.label.toLowerCase().replace(/\s+/g, '-')} data-score={strength.score}>
                <div className="password-strength-bar">
                  <div className="password-strength-fill" />
                </div>
                <p className="password-strength-label">{strength.label}</p>
              </div>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password" className="input-label">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              className={`input-field${confirmValue && !passwordsMatch ? ' input-field--error' : ''}`}
              placeholder="••••••••"
              required
              aria-describedby={confirmValue && !passwordsMatch ? 'pw-mismatch-error' : undefined}
              value={confirmValue}
              onChange={e => setConfirmValue(e.target.value)}
            />
            {confirmValue && !passwordsMatch && (
              <p className="input-error" id="pw-mismatch-error">Passwords do not match</p>
            )}
          </div>

          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
            />
            I accept the <Link href="/terms" className="auth-terms-link">Terms of Service</Link> and <Link href="/privacy" className="auth-terms-link">Privacy Policy</Link>
          </label>

          <button type="submit" className="btn btn-primary auth-btn-container" disabled={loading || !termsAccepted}>
            {loading ? (
              <><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner-sm"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Signing up...</>
            ) : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link href="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
