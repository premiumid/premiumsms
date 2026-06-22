'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, startTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MarketingNav() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      startTransition(() => {
        setUser(data?.user ?? null)
        setLoading(false)
      })
    })
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="navbar marketing-nav">
      <Link href="/" className="nav-brand" onClick={() => setOpen(false)}>
        Premium<span className="text-gradient">ID</span>
      </Link>
      <button
        className={`hamburger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} role="button" tabIndex={-1} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(false) }} />}
      <div className={`nav-links ${open ? 'nav-open' : ''}`}>
        <Link href="/services" className="nav-link" onClick={() => setOpen(false)}>Services</Link>
        <Link href="/pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</Link>
        <Link href="/docs" className="nav-link" onClick={() => setOpen(false)}>API</Link>
        {loading ? null : user ? (
          <>
            <Link href="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
            <span className="nav-user-email">{user.email}</span>
            <button className="btn btn-ghost" onClick={() => { setOpen(false); handleSignOut() }}>Log out</button>
          </>
        ) : (
          <>
            <Link href="/login" className="nav-link" onClick={() => setOpen(false)}>Log in</Link>
            <Link href="/register" className="btn btn-primary" onClick={() => setOpen(false)}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
