export default function RentalDetailLoading() {
  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ width: 100, height: 16, borderRadius: 4, background: 'var(--bg-muted)', marginBottom: '0.5rem' }} />
          <div style={{ width: 140, height: 28, borderRadius: 6, background: 'var(--bg-muted)' }} />
        </div>
        <div style={{ width: 80, height: 28, borderRadius: 9999, background: 'var(--bg-muted)' }} />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ width: 80, height: 12, borderRadius: 3, background: 'var(--bg-muted)', marginBottom: '0.375rem' }} />
            <div style={{ width: 140, height: 24, borderRadius: 4, background: 'var(--bg-muted)' }} />
          </div>
          <div style={{ width: 70, height: 32, borderRadius: 8, background: 'var(--bg-muted)' }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div style={{ width: 50, height: 12, borderRadius: 3, background: 'var(--bg-muted)', marginBottom: '0.25rem' }} />
              <div style={{ width: 80, height: 16, borderRadius: 4, background: 'var(--bg-muted)' }} />
            </div>
          ))}
        </div>
      </div>

      <div className="section-header section-header-spaced">
        <div style={{ width: 100, height: 20, borderRadius: 6, background: 'var(--bg-muted)' }} />
      </div>

      <div className="glass-panel sms-inbox">
        <div className="empty-state">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-muted)', margin: '0 auto 0.75rem' }} />
          <div style={{ width: 140, height: 16, borderRadius: 4, background: 'var(--bg-muted)', margin: '0 auto' }} />
        </div>
      </div>
    </div>
  )
}
