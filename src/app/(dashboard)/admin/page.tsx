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
          <div className="text-sm text-secondary mb-2 font-semibold uppercase tracking-wider">Total Revenue</div>
          <div className="text-3xl font-bold text-accent-primary">${stats.totalRevenue.toFixed(2)}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase tracking-wider">Total Users</div>
          <div className="text-3xl font-bold">{stats.totalUsers}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase tracking-wider">Active Rentals</div>
          <div className="text-3xl font-bold">{stats.activeRentals}</div>
        </div>
        <div className="glass-panel p-6 text-center">
          <div className="text-sm text-secondary mb-2 font-semibold uppercase tracking-wider">SMS Received</div>
          <div className="text-3xl font-bold">{stats.totalSmsReceived}</div>
        </div>
      </div>
    </div>
  )
}
