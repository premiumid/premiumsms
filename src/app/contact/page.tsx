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
      <section className="hero-wrapper contact-hero">
        <div className="container">
          <h1 className="hero-title">Contact Us</h1>
          <p className="hero-desc pricing-hero-desc">
            We respond to all messages within 24 hours.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-cards">
          {[
            { icon: 'email', label: 'Email', value: 'support@premiumid.io', href: 'mailto:support@premiumid.io' },
            { icon: 'docs', label: 'Docs & FAQ', value: 'Browse documentation', href: '/docs' },
            { icon: 'status', label: 'Status', value: 'System status', href: '/docs' },
          ].map(c => (
            <a key={c.label} href={c.href} className="contact-card">
              <div className="contact-card-icon">
                {c.icon === 'email' ? (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                ) : c.icon === 'docs' ? (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                ) : (
                  <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                )}
              </div>
              <div className="contact-card-label">{c.label}</div>
              <div className="contact-card-value">{c.value}</div>
            </a>
          ))}
        </div>

        <div className="contact-form-card">
          <h2 className="contact-form-title">Send a message</h2>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="services-footer">
        &copy; {new Date().getFullYear()} PremiumID. &nbsp;|&nbsp;
        <Link href="/privacy">Privacy</Link> &nbsp;|&nbsp;
        <Link href="/terms">Terms</Link>
      </footer>
    </div>
  )
}
