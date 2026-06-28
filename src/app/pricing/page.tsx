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
  { label: 'Telegram',      price: '$0.05',  countries: '80+'  },
  { label: 'WhatsApp',      price: '$0.08',  countries: '60+'  },
  { label: 'Google',        price: '$0.05',  countries: '90+'  },
  { label: 'Instagram',     price: '$0.10',  countries: '50+'  },
  { label: 'Facebook',      price: '$0.07',  countries: '70+'  },
  { label: 'Twitter / X',   price: '$0.09',  countries: '55+'  },
  { label: 'TikTok',        price: '$0.06',  countries: '65+'  },
  { label: 'Snapchat',      price: '$0.06',  countries: '60+'  },
  { label: 'Amazon',        price: '$0.08',  countries: '45+'  },
  { label: 'Microsoft',     price: '$0.08',  countries: '50+'  },
  { label: 'Uber',          price: '$0.07',  countries: '40+'  },
  { label: 'Other / 2500+', price: 'Varies', countries: '145+' },
]

const faqs = [
  { q: 'Does my balance expire?',     a: 'No. Your wallet balance never expires.' },
  { q: 'What if no code arrives?',    a: 'You are automatically refunded to your wallet within seconds.' },
  { q: 'Can I use crypto to top up?', a: 'Yes — we accept USDT (TRC-20) via NOWPayments.' },
  { q: 'Is there a minimum top-up?',  a: 'The minimum is $15 USD. The exact amount is shown in the top-up dialog.' },
]

export default function PricingPage() {
  return (
    <div>
      <MarketingNav />

      {/* ── Hero ── */}
      <section className="hero-wrapper services-page-hero">
        <div className="container pricing-hero-inner">
          <div className="hero-badge pricing-hero-badge">Transparent Pricing</div>
          <h1 className="hero-title">Pay only for what you use</h1>
          <p className="hero-desc pricing-hero-desc">
            No subscriptions. No hidden fees. Top up your wallet and spend as you go.
            Prices start from $0.05 per verification.
          </p>
        </div>
      </section>

      {/* ── Plan cards ── */}
      <section className="container pricing-plans-section">
        <div className="pricing-plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-plan-card${plan.highlight ? ' pricing-plan-card--highlight' : ''}`}
            >
              <p className="pricing-plan-badge">{plan.name}</p>
              <p className="pricing-plan-price">{plan.price}</p>
              <p className="pricing-plan-per">{plan.per}</p>
              <p className="pricing-plan-desc">{plan.description}</p>
              <ul className="pricing-plan-features">
                {plan.features.map((f) => (
                  <li key={f} className="pricing-plan-feature">
                    <span className="pricing-plan-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className="btn pricing-plan-cta">{plan.cta}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Price table ── */}
      <section className="container pricing-table-section">
        <div className="pricing-table-header">
          <h2 className="pricing-table-title">Example Prices by Service</h2>
          <p className="pricing-table-desc">Prices vary by country. Browse the full catalog after signing up.</p>
        </div>
        <div className="pricing-table-wrap">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Starting Price</th>
                <th>Countries</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier) => (
                <tr key={tier.label}>
                  <td>{tier.label}</td>
                  <td>{tier.price}</td>
                  <td>{tier.countries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="pricing-table-note">* Live prices from the provider. Exact cost shown before you confirm.</p>
      </section>

      {/* ── FAQ ── */}
      <section className="pricing-faq-section">
        <div className="pricing-faq-inner">
          <h2 className="pricing-faq-title">Pricing FAQ</h2>
          <div className="pricing-faq-list">
            {faqs.map(({ q, a }) => (
              <details key={q} className="pricing-faq-item">
                <summary className="pricing-faq-summary">{q}</summary>
                <p className="pricing-faq-answer">{a}</p>
              </details>
            ))}
          </div>
          <div className="pricing-faq-footer">
            <Link href="/faq" className="btn btn-secondary">View all FAQs</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pricing-page-footer">
        &copy; {new Date().getFullYear()} PremiumID. All rights reserved. &nbsp;|&nbsp;{' '}
        <Link href="/privacy">Privacy</Link> &nbsp;|&nbsp;{' '}
        <Link href="/terms">Terms</Link>
      </footer>
    </div>
  )
}
