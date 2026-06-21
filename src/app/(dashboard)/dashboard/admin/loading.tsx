export default function AdminLoading() {
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div style={{ width: 200, height: 28, borderRadius: 6, background: 'var(--bg-muted)', marginBottom: '0.375rem' }} />
        <div style={{ width: 300, height: 16, borderRadius: 4, background: 'var(--bg-muted)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
            <div style={{ width: '60%', height: 14, borderRadius: 4, background: 'var(--bg-muted)', marginBottom: '0.5rem' }} />
            <div style={{ width: '40%', height: 28, borderRadius: 6, background: 'var(--bg-muted)' }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
            <div style={{ width: '40%', height: 18, borderRadius: 4, background: 'var(--bg-muted)', marginBottom: '1rem' }} />
            <div style={{ width: '100%', height: 200, borderRadius: 8, background: 'var(--bg-muted)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
