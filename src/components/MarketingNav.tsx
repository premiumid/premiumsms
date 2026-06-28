'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect, useRef, startTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MarketingNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
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

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Close on navigation
  useEffect(() => { startTransition(() => setOpen(false)) }, [pathname])

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
        type="button"
        ref={hamburgerRef}
        className={`hamburger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </button>
      {open && <div className="nav-overlay" onClick={() => setOpen(false)} />}
      <div className={`nav-links ${open ? 'nav-open' : ''}`}>
        <Link href="/services" className="nav-link" onClick={() => setOpen(false)}>Services</Link>
        <Link href="/pricing" className="nav-link" onClick={() => setOpen(false)}>Pricing</Link>
        <Link href="/docs" className="nav-link" onClick={() => setOpen(false)}>API</Link>
        {loading ? null : user ? (
          <>
            <Link href="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
            <span className="nav-user-email">{user.email}</span>
            <button type="button" className="btn btn-ghost" onClick={() => { setOpen(false); handleSignOut() }}>Log out</button>
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
