'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '../actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const queryError = searchParams.get('error')
  const displayError = error ?? queryError

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="container auth-wrapper">
      <div className="glass-panel animate-fade-in auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Log in to access your dashboard</p>
        </div>

        {displayError && (
          <div className="auth-error">
            {displayError}
          </div>
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
              style={{ paddingRight: '2.5rem' }}
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
          </div>

          <div className="forgot-link">
            <Link href="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary auth-btn-container" disabled={loading}>
            {loading ? (
              <><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner-sm"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Logging in...</>
            ) : 'Log In'}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account? <Link href="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}
