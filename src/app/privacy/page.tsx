import Link from 'next/link'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'Privacy Policy — PremiumID',
  description: 'PremiumID Privacy Policy — how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div>
      <MarketingNav />

      <main className="container" style={{ padding: '6rem 1.5rem 6rem', maxWidth: '780px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.875rem' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {[
          {
            title: '1. Information We Collect',
            body: `We collect the following information when you use PremiumID:

• Account information: email address and display name provided at registration.
• Wallet and transaction data: top-up amounts, rental costs, refunds, and ledger history.
• Rental data: the service and country selected, the phone number assigned, rental status, and any SMS messages received during an active rental.
• API usage: API key metadata (prefix, name, last used timestamp) — we never store the raw key.
• Technical data: server logs including IP addresses, request timestamps, and error traces for security and debugging purposes.`,
          },
          {
            title: '2. How We Use Your Information',
            body: `We use your information to:

• Provide and operate the PremiumID service.
• Process wallet top-ups and deduct rental costs.
• Display rental history and SMS messages in your dashboard.
• Detect fraud, abuse, and policy violations.
• Respond to support requests.
• Improve the service.

We do not sell your personal data to third parties.`,
          },
          {
            title: '3. Data Storage',
            body: `Your data is stored in Supabase (PostgreSQL) with Row Level Security enabled. All wallet mutations use a server-side admin client — your balance cannot be modified from the browser. Data is hosted in the EU (Supabase default region) and encrypted at rest and in transit.`,
          },
          {
            title: '4. SMS Messages',
            body: `SMS messages received during your rentals are persisted to our database for the duration of the rental and are accessible only to you. After a rental expires or is cancelled, messages remain in our database for up to 30 days and are then deleted automatically.`,
          },
          {
            title: '5. Payments',
            body: `We process cryptocurrency payments through NOWPayments. We store the payment ID, amount, and status returned by NOWPayments. We do not store your crypto wallet address beyond what is required for payment verification.`,
          },
          {
            title: '6. Cookies',
            body: `We use session cookies provided by Supabase Auth to keep you logged in. No advertising or tracking cookies are used.`,
          },
          {
            title: '7. Third-Party Services',
            body: `We use the following third-party services:
• Supabase — authentication and database
• VirtualSMS — phone number provisioning
• NOWPayments — cryptocurrency payment processing

Each service has its own privacy policy.`,
          },
          {
            title: '8. Data Retention',
            body: `We retain your account data for as long as your account is active. If you request deletion, we will delete your account and associated data within 30 days, except where we are required to retain it for legal or fraud-prevention purposes.`,
          },
          {
            title: '9. Your Rights',
            body: `You have the right to:
• Access the personal data we hold about you.
• Correct inaccurate data.
• Request deletion of your account and data.
• Export your wallet transaction history.

To exercise these rights, email us at privacy@premiumid.io.`,
          },
          {
            title: '10. Changes to This Policy',
            body: `We may update this policy from time to time. Significant changes will be communicated via email or a notice in the dashboard.`,
          },
          {
            title: '11. Contact',
            body: `For privacy-related inquiries: privacy@premiumid.io`,
          },
        ].map(section => (
          <section key={section.title} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>{section.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: 1.75, whiteSpace: 'pre-line' }}>{section.body}</p>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} PremiumID. &nbsp;|&nbsp;{' '}
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link> &nbsp;|&nbsp;{' '}
          <Link href="/contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
        </p>
      </footer>
    </div>
  )
}
