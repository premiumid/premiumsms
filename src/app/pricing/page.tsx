import Link from 'next/link'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'Pricing — PremiumID',
  description: 'Simple, transparent pricing. Pay only for what you use. No subscriptions.',
}

const plans = [
  {
    name: 'Pay-as-you-go',
    price: 'From $0.05',
    per: 'per verification',
    description: 'Perfect for occasional use. Top up your wallet and spend only what you need.',
    features: [
      'No monthly fee',
      'Wallet balance never expires',
      '145+ countries',
      '2,500+ supported apps',
      'Instant delivery',
      'Auto-refund if no code arrives',
    ],
    cta: 'Get Started Free',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Developer API',
    price: 'Same rates',
    per: 'plus API access',
    description: 'Automate SMS verification at scale with our REST API or MCP integration.',
    features: [
      'Everything in Pay-as-you-go',
      'REST API (JSON)',
      'API key management',
      'MCP server support',
      '60 requests/min rate limit',
      'Webhook support',
    ],
    cta: 'View API Docs',
    href: '/docs',
    highlight: true,
  },
]

const tiers = [
  { label: 'Telegram', price: '$0.05', countries: '80+' },
  { label: 'WhatsApp', price: '$0.08', countries: '60+' },
  { label: 'Google', price: '$0.05', countries: '90+' },
  { label: 'Instagram', price: '$0.10', countries: '50+' },
  { label: 'Facebook', price: '$0.07', countries: '70+' },
  { label: 'Twitter / X', price: '$0.09', countries: '55+' },
  { label: 'TikTok', price: '$0.06', countries: '65+' },
  { label: 'Snapchat', price: '$0.06', countries: '60+' },
  { label: 'Amazon', price: '$0.08', countries: '45+' },
  { label: 'Microsoft', price: '$0.08', countries: '50+' },
  { label: 'Uber', price: '$0.07', countries: '40+' },
  { label: 'Other / 2500+', price: 'Varies', countries: '145+' },
]

export default function PricingPage() {
  return (
    <div>
      <MarketingNav />

      {/* Hero */}
      <section className="hero-wrapper" style={{ paddingBottom: '6rem' }}>
        <div className="container hero-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div className="hero-content" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="hero-badge">Transparent Pricing</div>
            <h1 className="hero-title">Pay only for what you use</h1>
            <p className="hero-desc" style={{ margin: '0 auto 2rem' }}>
              No subscriptions. No hidden fees. Top up your wallet and spend as you go.
              Prices start from $0.05 per verification.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container" style={{ padding: '5rem 1.5rem', marginTop: '-3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlight ? 'linear-gradient(135deg, #4c1d95, #2e1065)' : 'white',
                color: plan.highlight ? 'white' : 'var(--text-primary)',
                border: plan.highlight ? 'none' : '1px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                boxShadow: plan.highlight ? '0 20px 40px rgba(139,92,246,0.3)' : 'var(--shadow-md)',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem', color: plan.highlight ? 'white' : undefined }}>{plan.name}</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem', color: plan.highlight ? 'white' : 'var(--accent-primary)' }}>{plan.price}</div>
              <div style={{ fontSize: '0.75rem', marginBottom: '1rem', opacity: 0.7 }}>{plan.per}</div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.85 }}>{plan.description}</p>
              <ul style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: plan.highlight ? '#a78bfa' : 'var(--success)', fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="btn" style={{ width: '100%', background: plan.highlight ? 'white' : 'var(--accent-primary)', color: plan.highlight ? 'var(--accent-primary)' : 'white' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Price Table */}
      <section className="container" style={{ padding: '0 1.5rem 6rem' }}>
        <div className="section-header-center" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Example Prices by Service</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Prices vary by country. Browse full catalog after signing up.</p>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Service</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Starting Price</th>
                <th style={{ padding: '0.875rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Countries</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => (
                <tr key={tier.label} style={{ borderBottom: i < tiers.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>{tier.label}</td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--accent-primary)', fontWeight: 700 }}>{tier.price}</td>
                  <td style={{ padding: '0.875rem 1.25rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{tier.countries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          * Live prices from the provider. Exact amounts shown before you confirm.
        </p>
      </section>

      {/* FAQ snippet */}
      <section style={{ background: 'var(--bg-tertiary)', padding: '5rem 1.5rem' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>Pricing FAQ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { q: 'Does my balance expire?', a: 'No. Your wallet balance never expires.' },
              { q: 'What if no code arrives?', a: 'You are automatically refunded to your wallet within seconds.' },
              { q: 'Can I use crypto to top up?', a: 'Yes — we accept USDT (TRC-20) via NOWPayments.' },
              { q: 'Is there a minimum top-up?', a: 'The minimum is ~$3 USD due to USDT (TRC-20) network minimums.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
                <summary style={{ fontWeight: 600, cursor: 'pointer', fontSize: '0.9375rem' }}>{q}</summary>
                <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{a}</p>
              </details>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/faq" className="btn btn-secondary">View all FAQs</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          &copy; {new Date().getFullYear()} PremiumID. All rights reserved. &nbsp;|&nbsp;{' '}
          <Link href="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/terms" style={{ color: 'var(--text-secondary)' }}>Terms</Link>
        </p>
      </footer>
    </div>
  )
}
