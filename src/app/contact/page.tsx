import Link from 'next/link'
import ContactForm from './ContactForm'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'Contact — PremiumID',
  description: 'Get in touch with the PremiumID team.',
}

export default function ContactPage() {
  return (
    <div>
      <MarketingNav />

      {/* Hero */}
      <section className="hero-wrapper" style={{ paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-desc" style={{ margin: '0 auto' }}>
            We respond to all messages within 24 hours.
          </p>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '700px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: 'email', label: 'Email', value: 'support@premiumid.io', href: 'mailto:support@premiumid.io' },
            { icon: 'docs', label: 'Docs & FAQ', value: 'Browse documentation', href: '/docs' },
            { icon: 'status', label: 'Status', value: 'System status', href: '/docs' },
          ].map(c => (
            <a key={c.label} href={c.href} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', display: 'block', textDecoration: 'none', color: 'inherit' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {c.icon === 'email' ? (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ) : c.icon === 'docs' ? (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                ) : (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                )}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{c.label}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>{c.value}</div>
            </a>
          ))}
        </div>

        {/* Contact form (static — can wire to an email API) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Send a message</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} PremiumID. &nbsp;|&nbsp;{' '}
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
        </p>
      </footer>
    </div>
  )
}
