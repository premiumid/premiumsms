import Link from 'next/link'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'Terms of Service — PremiumID',
  description: 'PremiumID Terms of Service.',
}

export default function TermsPage() {
  return (
    <div>
      <MarketingNav />

      <main className="container" style={{ padding: '6rem 1.5rem 6rem', maxWidth: '780px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '0.875rem' }}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        {[
          {
            title: '1. Acceptance of Terms',
            body: `By creating an account or using PremiumID ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.`,
          },
          {
            title: '2. Description of Service',
            body: `PremiumID provides temporary virtual phone numbers for receiving SMS verification codes. Numbers are rented for a limited duration and expire automatically. The Service is provided on an "as-is" basis.`,
          },
          {
            title: '3. Acceptable Use',
            body: `You may use the Service only for lawful purposes. You must not:

• Use the Service to commit fraud, impersonation, or identity theft.
• Use the Service to bypass legal age verification or know-your-customer (KYC) requirements.
• Create accounts on services in violation of those services' terms.
• Abuse, resell, or share your account credentials with third parties.
• Use the API to circumvent rate limits or to access another user's data.
• Engage in any activity that harms the Service or other users.

We reserve the right to suspend or ban accounts that violate these terms, without refund.`,
          },
          {
            title: '4. Account Responsibilities',
            body: `You are responsible for maintaining the security of your account credentials and API keys. You must notify us immediately if you suspect unauthorized access. We are not liable for losses resulting from unauthorized account access due to your negligence.`,
          },
          {
            title: '5. Wallet and Payments',
            body: `Wallet balances are non-transferable and non-withdrawable. Top-ups are final and non-refundable except as described in Section 6. We reserve the right to freeze wallets associated with fraudulent activity.`,
          },
          {
            title: '6. Refunds',
            body: `Automatic refunds are issued to your wallet if a rental expires without receiving an SMS code. Manual refunds to cryptocurrency wallets are not supported. We do not issue fiat refunds for wallet top-ups.`,
          },
          {
            title: '7. Service Availability',
            body: `We do not guarantee 100% uptime or the availability of any specific service or country. Numbers are subject to provider inventory. If a number becomes unavailable after an order is placed, you will be refunded automatically.`,
          },
          {
            title: '8. Intellectual Property',
            body: `All content, trademarks, and intellectual property on the Service are owned by PremiumID or its licensors. You may not copy, reproduce, or distribute any part of the Service without our written permission.`,
          },
          {
            title: '9. Limitation of Liability',
            body: `To the maximum extent permitted by law, PremiumID and its affiliates are not liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability for any claim is limited to the amount you paid in the 30 days preceding the claim.`,
          },
          {
            title: '10. Termination',
            body: `We may suspend or terminate your account at any time for violations of these Terms. You may delete your account at any time by contacting support. Upon termination, your wallet balance is forfeited if the account was terminated for policy violations.`,
          },
          {
            title: '11. Changes to Terms',
            body: `We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms. We will notify users of material changes via email.`,
          },
          {
            title: '12. Governing Law',
            body: `These Terms are governed by the laws of the jurisdiction in which PremiumID operates. Any disputes shall be resolved through binding arbitration or in the courts of that jurisdiction.`,
          },
          {
            title: '13. Contact',
            body: `For legal inquiries: legal@premiumid.io`,
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
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/contact" style={{ color: 'var(--text-muted)' }}>Contact</Link>
        </p>
      </footer>
    </div>
  )
}
