export default function NumbersLoading() {
  return (
    <div className="catalog-grid-layout">
      <aside className="catalog-sidebar">
        <div className="catalog-sidebar-search">
          <div style={{ height: 38, borderRadius: 9999, background: 'var(--bg-tertiary)' }} />
        </div>
        <div className="catalog-sidebar-list">
          {[70, 55, 65, 45, 75, 60].map((w, i) => (
            <div key={i} className="catalog-sidebar-item" style={{ cursor: 'default' }}>
              <div className="catalog-sidebar-item-left" style={{ gap: '0.5rem' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-tertiary)' }} />
                <div style={{ width: `${w}%`, height: 14, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
              </div>
            </div>
          ))}
        </div>
      </aside>
      <main className="catalog-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid var(--bg-tertiary)', borderTopColor: 'var(--accent-primary)', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Loading services…</p>
        </div>
      </main>
    </div>
  )
}
