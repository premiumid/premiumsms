import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | PremiumID',
  description: 'This page does not exist.',
}

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem', textAlign: 'center' }}>
      <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem' }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem' }}>
        This page doesn&apos;t exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Go Home
      </Link>
    </div>
  )
}
