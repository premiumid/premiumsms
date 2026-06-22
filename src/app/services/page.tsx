'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import ServiceIcon from '../../components/ServiceIcon'
import MarketingNav from '../../components/MarketingNav'

const services = [
  { name: 'Telegram', slug: 'telegram', color: '#2AABEE', desc: 'Verify Telegram accounts instantly. Most countries from $0.05.', popular: true },
  { name: 'WhatsApp', slug: 'whatsapp', color: '#25D366', desc: 'WhatsApp numbers for account creation and re-verification.', popular: true },
  { name: 'Google', slug: 'google', color: '#EA4335', desc: 'Gmail and Google account verification. High availability.', popular: true },
  { name: 'Instagram', slug: 'instagram', color: '#E4405F', desc: 'Create or verify Instagram accounts with temp numbers.', popular: true },
  { name: 'Facebook', slug: 'facebook', color: '#1877F2', desc: 'Facebook registration and account recovery.', popular: true },
  { name: 'Twitter / X', slug: 'x', color: '#000000', desc: 'X (Twitter) account sign-up verification.', popular: false },
  { name: 'TikTok', slug: 'tiktok', color: '#000000', desc: 'TikTok account creation across multiple regions.', popular: false },
  { name: 'Snapchat', slug: 'snapchat', color: '#FFFC00', desc: 'Snapchat number verification for new accounts.', popular: false },
  { name: 'Amazon', slug: 'amazon', color: '#FF9900', desc: 'Amazon account verification and 2FA.', popular: false },
  { name: 'Microsoft', slug: 'microsoft', color: '#00A4EF', desc: 'Outlook and Microsoft account sign-up.', popular: false },
  { name: 'Uber', slug: 'uber', color: '#000000', desc: 'Uber rider and driver registration.', popular: false },
  { name: 'PayPal', slug: 'paypal', color: '#00457C', desc: 'PayPal account creation and phone verification.', popular: false },
  { name: 'Steam', slug: 'steam', color: '#000000', desc: 'Steam account and game verification.', popular: false },
  { name: 'Discord', slug: 'discord', color: '#5865F2', desc: 'Discord phone verification for new accounts.', popular: false },
  { name: 'LinkedIn', slug: 'linkedin', color: '#0A66C2', desc: 'LinkedIn profile creation and sign-in verification.', popular: false },
  { name: 'Airbnb', slug: 'airbnb', color: '#FF5A5F', desc: 'Airbnb account sign-up verification.', popular: false },
  { name: 'Tinder', slug: 'tinder', color: '#FF6B6B', desc: 'Tinder account verification.', popular: false },
  { name: 'OkCupid', slug: 'okcupid', color: '#ED1965', desc: 'OkCupid account sign-up and verification.', popular: false },
  { name: 'Binance', slug: 'binance', color: '#F0B90B', desc: 'Binance exchange KYC phone step.', popular: false },
  { name: '2500+ more', slug: '', color: '#4f46e5', desc: 'Browse the full catalog after signing up. New services added weekly.', popular: false },
]

export default function ServicesPage() {
  useEffect(() => { document.title = 'Services — PremiumID' }, [])

  const popular = services.filter(s => s.popular)
  const rest = services.filter(s => !s.popular)

  return (
    <div>
      <MarketingNav />

      {/* Hero */}
      <section className="hero-wrapper services-page-hero">
        <div className="container">
          <div className="hero-badge" style={{ margin: '0 auto 1.5rem' }}>2,500+ Services</div>
          <h1 className="hero-title">Every verification.<br /><span className="text-gradient">Every platform.</span></h1>
          <p className="hero-desc" style={{ margin: '0 auto' }}>
            Real numbers for every major app across 145+ countries. Live stock, instant delivery, auto-refund guaranteed.
          </p>
        </div>
      </section>

      {/* Popular Services */}
      <section className="container services-section">
        <h2 className="services-section-title">Most Popular</h2>
        <div className="services-grid-lg">
          {popular.map(s => (
            <div key={s.name} className="services-card">
              <ServiceIcon slug={s.slug} name={s.name} />
              <h3 className="services-card-name">{s.name}</h3>
              <p className="services-card-desc">{s.desc}</p>
              <Link href="/register" className="btn btn-primary services-card-btn">Get a Number</Link>
            </div>
          ))}
        </div>
      </section>

      {/* All Services */}
      <section className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        <h2 className="services-section-title">All Services</h2>
        <div className="services-grid-lg">
          {rest.map(s => (
            <div key={s.name} className="services-card">
              <ServiceIcon slug={s.slug} name={s.name} />
              <h3 className="services-card-name">{s.name}</h3>
              <p className="services-card-desc">{s.desc}</p>
              <Link href="/register" className="btn btn-secondary services-card-btn">Get a Number</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="services-cta" style={{ background: 'var(--bg-muted)' }}>
        <h2 className="services-cta-title">Don&apos;t see your service?</h2>
        <p className="services-cta-desc">We support 2,500+ services. Browse the full live catalog after signing up.</p>
        <Link href="/register" className="btn" style={{ background: 'var(--bg-card)', color: 'var(--accent)', padding: '0.875rem 2rem', fontSize: '1rem' }}>
          Browse Full Catalog
        </Link>
      </section>

      {/* Footer */}
      <footer className="services-footer">
        &copy; {new Date().getFullYear()} PremiumID. All rights reserved. &nbsp;|&nbsp;
        <Link href="/privacy">Privacy</Link> &nbsp;|&nbsp;
        <Link href="/terms">Terms</Link>
      </footer>
    </div>
  )
}
