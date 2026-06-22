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
      <section className="hero-wrapper pb-24">
        <div className="container hero-container justify-center text-center">
          <div className="hero-content max-w-[640px] mx-auto">
            <div className="hero-badge">Transparent Pricing</div>
            <h1 className="hero-title">Pay only for what you use</h1>
            <p className="hero-desc mx-auto mb-8">
              No subscriptions. No hidden fees. Top up your wallet and spend as you go.
              Prices start from $0.05 per verification.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="container py-20 px-6 -mt-12">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 max-w-[800px] mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                ...(plan.highlight
                  ? { background: 'var(--accent)', color: 'white', boxShadow: '0 20px 40px rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.3)' }
                   : { background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }
                )
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: plan.highlight ? 'white' : undefined }}>{plan.name}</h3>
              <div style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.25rem', color: plan.highlight ? 'white' : 'var(--accent)' }}>{plan.price}</div>
              <div style={{ fontSize: '0.75rem', marginBottom: '1rem', opacity: 0.7 }}>{plan.per}</div>
              <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', opacity: 0.85 }}>{plan.description}</p>
              <ul style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, color: plan.highlight ? 'var(--accent-muted)' : 'var(--success)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="btn" style={{ width: '100%', background: plan.highlight ? 'white' : 'var(--accent)', color: plan.highlight ? 'var(--accent)' : 'white' }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Price Table */}
      <section className="container px-6 pb-24">
        <div className="section-header-center text-center mb-8">
          <h2 className="text-3xl font-bold">Example Prices by Service</h2>
          <p className="text-secondary mt-2">Prices vary by country. Browse full catalog after signing up.</p>
        </div>
        <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border)' }}>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-secondary uppercase tracking-widest">Service</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-secondary uppercase tracking-widest">Starting Price</th>
                <th className="py-3.5 px-5 text-left text-xs font-semibold text-secondary uppercase tracking-widest">Countries</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => (
                <tr key={tier.label} className={i < tiers.length - 1 ? 'border-b border-border' : ''}>
                  <td className="py-3.5 px-5 text-sm font-semibold">{tier.label}</td>
                  <td className="py-3.5 px-5 text-sm text-accent font-bold">{tier.price}</td>
                  <td className="py-3.5 px-5 text-sm text-secondary">{tier.countries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-center mt-6 text-sm text-secondary">
          * Live prices from the provider. Exact amounts shown before you confirm.
        </p>
      </section>

      {/* FAQ snippet */}
      <section className="bg-tertiary py-20 px-6">
        <div className="container max-w-[700px]">
          <h2 className="text-2xl font-bold mb-8 text-center">Pricing FAQ</h2>
          <div className="flex flex-col gap-4">
            {[
              { q: 'Does my balance expire?', a: 'No. Your wallet balance never expires.' },
              { q: 'What if no code arrives?', a: 'You are automatically refunded to your wallet within seconds.' },
              { q: 'Can I use crypto to top up?', a: 'Yes — we accept USDT (TRC-20) via NOWPayments.' },
              { q: 'Is there a minimum top-up?', a: 'The minimum is ~$12 USD due to USDT (TRC-20) network minimums.' },
            ].map(({ q, a }) => (
              <details key={q} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem' }}>
                <summary className="font-semibold cursor-pointer text-[15px]">{q}</summary>
                <p className="mt-3 text-secondary text-sm">{a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="btn btn-secondary">View all FAQs</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-sm text-secondary">
          &copy; {new Date().getFullYear()} PremiumID. All rights reserved. &nbsp;|&nbsp;{' '}
          <Link href="/privacy" className="text-secondary">Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/terms" className="text-secondary">Terms</Link>
        </p>
      </footer>
    </div>
  )
}
