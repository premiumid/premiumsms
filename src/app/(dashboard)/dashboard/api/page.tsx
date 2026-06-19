import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ApiClient from './ApiClient'

export const metadata = {
  title: 'Developer API - PremiumID',
}

export default async function ApiDocsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch active API keys for the user
  const { data: keys, error } = await supabase
    .from('api_keys')
    .select('id, name, prefix, is_active, last_used_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to load API keys in dashboard:', error)
  }

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1 className="page-title">Developer API</h1>
        <p className="page-subtitle">Manage your API credentials and explore the integration docs</p>
      </div>

      <ApiClient initialKeys={keys || []} />
    </div>
  )
}
