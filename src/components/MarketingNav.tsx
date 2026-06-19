'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MarketingNav() {
  const [open, setOpen] = useState(false)

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
        <Link href="/login" className="nav-link" onClick={() => setOpen(false)}>Log in</Link>
        <Link href="/register" className="btn btn-primary" onClick={() => setOpen(false)}>Get Started</Link>
      </div>
    </nav>
  )
}
