export default function RentalsLoading() {
  return (
    <div className="catalog-grid-layout">
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-search">
          <div style={{ height: 38, borderRadius: 9999, background: 'var(--bg-muted)' }} />
        </div>
        <div className="catalog-sidebar-list">
          {[60, 50, 70, 55, 65, 45, 75, 60, 50, 55].map((w, i) => (
            <div key={i} className="catalog-sidebar-item" style={{ cursor: 'default' }}>
              <div className="catalog-sidebar-item-left" style={{ gap: '0.625rem' }}>
                <div style={{ width: 20, height: 15, borderRadius: 2, background: 'var(--bg-muted)' }} />
                <div style={{ width: `${w}%`, height: 14, borderRadius: 4, background: 'var(--bg-muted)' }} />
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="catalog-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60%', maxWidth: 400, height: 44, borderRadius: 9999, background: 'var(--bg-muted)' }} />
          <div style={{ width: 160, height: 36, borderRadius: 9999, background: 'var(--bg-muted)' }} />
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
      <aside className="catalog-right" style={{ background: 'var(--bg)' }}>
        <div style={{ padding: '1.5rem 1rem' }}>
          <div style={{ width: '50%', height: 18, borderRadius: 4, background: 'var(--bg-muted)', marginBottom: '1.5rem' }} />
          <div style={{ width: '100%', height: 120, borderRadius: 12, background: 'var(--bg-muted)', marginBottom: '1.5rem' }} />
          <div style={{ width: '100%', height: 44, borderRadius: 9999, background: 'var(--bg-muted)' }} />
        </div>
      </aside>
    </div>
  )
}
