import { getAdminStats } from '@/lib/supabase/admin'

export const metadata = {
  title: 'Admin Dashboard - PremiumID',
}

export default async function AdminPage() {
  const stats = await getAdminStats()

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and global statistics</p>
      </div>

      <div className="admin-stats-grid">
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>Total Revenue</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--accent)' }}>${stats.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>Total Users</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>{stats.totalUsers}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>Active Rentals</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>{stats.activeRentals}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase" style={{ letterSpacing: '0.05em' }}>SMS Received</div>
          <div style={{ fontSize: '1.875rem', fontWeight: 700 }}>{stats.totalSmsReceived}</div>
        </div>
      </div>
    </div>
  )
}
