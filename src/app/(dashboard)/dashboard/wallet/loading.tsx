export default function WalletLoading() {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ width: 120, height: 28, borderRadius: 6, background: 'var(--bg-tertiary)', marginBottom: '0.375rem' }} />
        <div style={{ width: 260, height: 16, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
      </div>

      <div className="wallet-grid">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ width: 80, height: 14, borderRadius: 4, background: 'var(--bg-tertiary)', marginBottom: '0.5rem' }} />
          <div style={{ width: 120, height: 32, borderRadius: 6, background: 'var(--bg-tertiary)' }} />
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ width: 100, height: 14, borderRadius: 4, background: 'var(--bg-tertiary)', marginBottom: '1rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 40, borderRadius: 8, background: 'var(--bg-tertiary)' }} />
            ))}
          </div>
          <div style={{ width: '100%', height: 44, borderRadius: 8, background: 'var(--bg-tertiary)' }} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ width: 160, height: 20, borderRadius: 6, background: 'var(--bg-tertiary)', marginBottom: '1rem' }} />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 0', borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-tertiary)' }} />
              <div>
                <div style={{ width: 120, height: 14, borderRadius: 4, background: 'var(--bg-tertiary)', marginBottom: '0.25rem' }} />
                <div style={{ width: 80, height: 12, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
              </div>
            </div>
            <div style={{ width: 60, height: 16, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
