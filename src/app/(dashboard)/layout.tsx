import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { signout } from '@/app/(auth)/actions'
import NavTabs from './NavTabs'
import OnboardingTour from '@/components/OnboardingTour'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let balance = 0;
  
  if (user) {
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single()
    balance = wallet?.balance ?? 0
  }

  const emailUnverified = user && !user.email_confirmed_at

  return (
    <div className="app-layout">
      {emailUnverified && (
        <div className="verify-email-banner">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Please verify your email address. Check your inbox or{' '}
          <Link href="/resend-verification" className="font-bold">resend verification email</Link>.
        </div>
      )}
      {/* Top Navbar */}
      <nav className="app-navbar">
        <Link href="/" className="app-brand">
          Premium<span className="text-gradient">ID</span>
        </Link>
        <NavTabs />
        
        <div className="app-user">
          {user ? (
            <>
              <Link href="/dashboard/wallet" className="app-balance">
                ${Number(balance).toFixed(2)}
              </Link>
              <form action={signout}>
                <button type="submit" className="btn btn-secondary">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="font-semibold text-sm text-primary">Log in</Link>
              <Link href="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      <main id="main-content" className="app-content-wrapper">
        {children}
      </main>
      <OnboardingTour />
    </div>
  )
}
