'use client'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="app-layout">
      <nav className="app-navbar">
        <div className="app-brand">Premium<span className="text-gradient">ID</span></div>
      </nav>
      <div className="app-content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button onClick={reset} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
