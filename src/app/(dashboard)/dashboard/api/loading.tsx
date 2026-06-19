export default function ApiLoading() {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ width: 160, height: 28, borderRadius: 6, background: 'var(--bg-tertiary)', marginBottom: '0.375rem' }} />
        <div style={{ width: 340, height: 16, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
      </div>
      <div style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ width: 140, height: 20, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
          <div style={{ width: 120, height: 36, borderRadius: 8, background: 'var(--bg-tertiary)' }} />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
              <div>
                <div style={{ width: 100, height: 14, borderRadius: 4, background: 'var(--bg-tertiary)', marginBottom: '0.25rem' }} />
                <div style={{ width: 60, height: 12, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
              </div>
            </div>
            <div style={{ width: 60, height: 28, borderRadius: 6, background: 'var(--bg-tertiary)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
