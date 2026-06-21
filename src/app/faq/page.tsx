import Link from 'next/link'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'FAQ — PremiumID',
  description: 'Frequently asked questions about PremiumID SMS verification.',
}

const faqs = [
  {
    category: 'General',
    items: [
      {
        q: 'What is PremiumID?',
        a: 'PremiumID is a temporary phone number service. You rent a real number, receive your SMS verification code, and the number expires. Perfect for apps that block VoIP numbers.',
      },
      {
        q: 'How is PremiumID different from VoIP numbers?',
        a: 'We provide real SIM-backed numbers that are accepted by WhatsApp, Telegram, Google, and other platforms that reject VoIP. Our numbers come from real carrier inventory across 145+ countries.',
      },
      {
        q: 'Do I need to sign up to browse services?',
        a: 'No. You can browse services and example prices on the landing page and /services. You only need an account to actually rent a number.',
      },
    ],
  },
  {
    category: 'Rentals & Numbers',
    items: [
      {
        q: 'How fast do codes arrive?',
        a: 'Most SMS codes arrive within 30-60 seconds. In rare cases it can take up to 3 minutes depending on carrier routing.',
      },
      {
        q: 'What happens if no code arrives?',
        a: 'If the rental expires without receiving a code, you are automatically refunded the full amount to your wallet.',
      },
      {
        q: 'Can I cancel a rental early?',
        a: 'Yes. You can cancel any active rental from your dashboard. You will receive a full refund to your wallet.',
      },
      {
        q: 'Can I reuse a number?',
        a: "Numbers are single-use. Once a rental expires or is cancelled, you can't use that number again. This is by design — most platforms would reject a reused verification number anyway.",
      },
      {
        q: 'How long does a rental last?',
        a: 'Rental durations vary by service and country, typically 5-20 minutes. The exact expiry time is shown before you confirm.',
      },
    ],
  },
  {
    category: 'Wallet & Payments',
    items: [
      {
        q: 'How do I add funds?',
        a: 'Go to Dashboard → Wallet → Top Up. We accept USDT (TRC-20) via NOWPayments. Funds are credited automatically once the payment confirms on-chain.',
      },
      {
        q: 'What is the minimum top-up?',
        a: 'The minimum is approximately $12 USD due to USDT (TRC-20) network minimums. The exact minimum is shown in the top-up dialog.',
      },
      {
        q: 'Does my balance expire?',
        a: 'No. Your wallet balance never expires.',
      },
      {
        q: 'Can I get a refund to my crypto wallet?',
        a: 'Currently we only support refunds back to your PremiumID wallet. Withdrawal to external wallets is not yet supported.',
      },
    ],
  },
  {
    category: 'Developer API',
    items: [
      {
        q: 'How do I use the API?',
        a: 'Generate an API key in Dashboard → API Keys. Pass it as the X-API-Key header on any request. See /docs for full documentation.',
      },
      {
        q: 'What is the rate limit?',
        a: '60 requests per minute per API key. Exceeding this returns 429 Too Many Requests.',
      },
      {
        q: 'Is there MCP support?',
        a: 'Yes. PremiumID supports the Model Context Protocol, allowing AI assistants like Claude to rent numbers and retrieve codes autonomously.',
      },
      {
        q: 'Are API keys shown after creation?',
        a: 'Your full API key is shown exactly once, immediately after creation. Store it securely — we only store a hash and cannot recover the raw key.',
      },
    ],
  },
  {
    category: 'Security & Privacy',
    items: [
      {
        q: 'Do you store the SMS messages?',
        a: 'SMS messages are fetched from the provider in real time and also persisted in our database for the duration of your rental. They are deleted when the rental is cleaned up.',
      },
      {
        q: 'Is my wallet secure?',
        a: 'Yes. All wallet mutations (credits, debits, refunds) happen server-side using a service-role admin client that bypasses Row Level Security. No browser code can touch your balance directly.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes. Contact us at support@premiumid.io and we will delete your account and all associated data within 30 days.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <div>
      <MarketingNav />

      {/* Hero */}
      <section className="hero-wrapper" style={{ paddingBottom: '5rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="hero-title">Frequently Asked<br /><span className="text-gradient">Questions</span></h1>
          <p className="hero-desc" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Can&apos;t find the answer? Email us at <a href="mailto:support@premiumid.io" style={{ color: 'var(--accent)' }}>support@premiumid.io</a>
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="container" style={{ padding: '4rem 1.5rem 6rem', maxWidth: '800px' }}>
        {faqs.map(group => (
          <div key={group.category} style={{ marginBottom: '3rem' }}>
            <h2 className="font-bold text-accent mb-4 uppercase" style={{ letterSpacing: '0.05em', fontSize: '13px' }}>
              {group.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {group.items.map(({ q, a }) => (
                <details key={q} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  <summary className="font-semibold cursor-pointer" style={{ fontSize: '15px' }}>{q}</summary>
                  <p className="mt-3 text-secondary" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>{a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Still need help */}
        <div style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Still need help?</h3>
          <p className="text-secondary mb-6" style={{ fontSize: '0.875rem' }}>Our team responds within 24 hours.</p>
          <Link href="/contact" className="btn btn-primary">Contact Support</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p className="text-sm text-secondary">
          &copy; {new Date().getFullYear()} PremiumID. &nbsp;|&nbsp;{' '}
          <Link href="/privacy" className="text-secondary">Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/terms" className="text-secondary">Terms</Link>
        </p>
      </footer>
    </div>
  )
}
