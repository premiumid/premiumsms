export default function DashboardLoading() {
  return (
    <div className="app-layout">
      <nav className="app-navbar">
        <div className="app-brand">Premium<span className="text-gradient">ID</span></div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ width: 70, height: 20, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
          <div style={{ width: 80, height: 32, borderRadius: 8, background: 'var(--bg-tertiary)' }} />
        </div>
      </nav>
      <div className="app-content-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Loading…</p>
        </div>
      </div>
    </div>
  )
}
