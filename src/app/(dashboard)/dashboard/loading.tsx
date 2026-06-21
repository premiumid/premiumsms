export default function DashboardLoading() {
  return (
    <div className="catalog-grid-layout">
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-search">
          <div style={{ height: 38, borderRadius: 9999, background: 'var(--bg-muted)' }} />
        </div>
        <div className="catalog-sidebar-list">
          {[70, 55, 65, 45, 75, 60, 50, 80].map((w, i) => (
            <div key={i} className="catalog-sidebar-item" style={{ cursor: 'default' }}>
              <div className="catalog-sidebar-item-left" style={{ gap: '0.5rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-muted)' }} />
                <div style={{ width: `${w}%`, height: 14, borderRadius: 4, background: 'var(--bg-muted)' }} />
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="catalog-main">
        <div className="catalog-header">
          <div style={{ width: '40%', height: 24, borderRadius: 6, background: 'var(--bg-muted)', marginBottom: '0.5rem' }} />
          <div style={{ width: '60%', height: 16, borderRadius: 4, background: 'var(--bg-muted)' }} />
        </div>
        <div className="catalog-apps-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="catalog-app-card" style={{ pointerEvents: 'none', padding: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-muted)', margin: '0 auto 0.75rem' }} />
              <div style={{ width: '70%', height: 14, borderRadius: 4, background: 'var(--bg-muted)', margin: '0 auto' }} />
            </div>
          ))}
        </div>
      </main>
      <aside className="catalog-right">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', padding: '2rem 1rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-muted)' }} />
          <div style={{ width: '70%', height: 20, borderRadius: 6, background: 'var(--bg-muted)' }} />
          <div style={{ width: '90%', height: 14, borderRadius: 4, background: 'var(--bg-muted)' }} />
          <div style={{ width: '100%', height: 44, borderRadius: 9999, background: 'var(--bg-muted)', marginTop: '1rem' }} />
        </div>
      </aside>
    </div>
  )
}
