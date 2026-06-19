import Link from "next/link";
import ServicesGrid from "./ServicesGrid";
import MarketingNav from "../components/MarketingNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PremiumID — Real SIM SMS Verification",
  description: "Receive SMS verification codes instantly using real non-VoIP numbers. WhatsApp, Telegram, Google, and 2,500+ services across 145+ countries.",
};

export default function Home() {
  return (
    <div>
      <MarketingNav />

      <main>
        {/* Hero Section */}
        <section className="hero-wrapper">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Works where VoIP Numbers don&apos;t
            </div>
            <h1 className="hero-title">
              Skip the retry loop.<br />
              <span className="text-gradient">Get the code.</span>
            </h1>
            <p className="hero-desc">
              Temporary numbers for WhatsApp, Telegram, Google, Instagram, and 2,500+ platforms across 145+ countries.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary">
                Find a Number &rarr;
              </Link>
              <Link href="/services" className="btn btn-secondary">
                How It Works
              </Link>
            </div>
            <div className="hero-footnote">
              Live prices &bull; No signup to browse &bull; Crypto payments
            </div>
          </div>
          <div className="hero-image">
            {/* Using a placeholder since we don't have the 3D phone asset */}
            <div style={{ width: '320px', height: '640px', background: '#0f172a', borderRadius: '40px', border: '8px solid #334155', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '120px', height: '24px', background: '#334155', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}></div>
              <div style={{ padding: '4rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '0.875rem' }}>
                  <strong>Snapchat</strong><br/>Your Snapchat code is 88412
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '0.875rem' }}>
                  <strong>Telegram</strong><br/>Your Telegram code is 94726. Do not share this.
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: 'white', fontSize: '0.875rem' }}>
                  <strong>WhatsApp</strong><br/>Your WhatsApp verification code is 228-714
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="trust-bar">
        <div className="container">
          <div className="trust-features">
            <div className="trust-feature">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              30-60s Delivery
            </div>
            <div className="trust-feature">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              No Code? Auto-Refund
            </div>
            <div className="trust-feature">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              REST API + MCP
            </div>
            <div className="trust-feature">
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
              24/7 Automated
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container" style={{ padding: "6rem 1.5rem" }}>
        <div className="section-header-center">
          <h2 className="section-title">Browse Services & Prices</h2>
          <p className="section-subtitle">See exactly what you&apos;ll pay before signing up. Real prices, live stock.</p>
        </div>
        <ServicesGrid />
        <div className="services-footer" style={{ marginTop: '3rem' }}>
          <Link href="/services" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '9999px', fontWeight: 600 }}>
            View All Services &rarr;
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container" style={{ padding: "2rem 1.5rem 6rem 1.5rem" }}>
        <div className="section-header-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get verified in three simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3>Choose App & Country</h3>
            <p>Live stock and prices ready. Pick the cheapest route that works for you.</p>
          </div>
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3>Add Funds to Buy</h3>
            <p>Pay with crypto only when you&apos;re ready. No subscription.</p>
          </div>
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>Receive Your Code</h3>
            <p>Codes arrive in seconds. No SMS? Your balance is refunded automatically.</p>
          </div>
        </div>
      </section>

      {/* Features Split */}
      <section className="container" style={{ padding: "2rem 1.5rem 6rem 1.5rem" }}>
        <div className="features-split">
          <div className="features-content">
            <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>ABOUT OUR SERVICE</div>
            <h2>What is a temporary SMS number?</h2>
            <p>Ensure reliable SMS delivery with real physical SIM cards. VirtualSMS provides clean, non-VoIP numbers for OTP verification, multi-account management, and AI agent automation. Unlike standard virtual numbers, our carrier routes work seamlessly on platforms that filter or reject VoIP providers like Twilio and Google Voice.</p>
            <p>Access numbers across 145+ countries for over 2,500 platforms. Whether you need a 20-minute disposable number for a quick OTP or a private long-term rental for ongoing account security, our automated platform delivers your SMS codes instantly.</p>
            
            <h4 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.125rem' }}>When you might need a temporary SMS number</h4>
            <ul className="features-list">
              <li>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}><strong>High deliverability verification:</strong> Successfully receive OTPs on platforms (WhatsApp, Telegram, Tinder) that filter or reject standard virtual numbers.</span>
              </li>
              <li>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}><strong>Protect personal privacy:</strong> Keep your real phone number off public databases and avoid spam when registering for services.</span>
              </li>
              <li>
                <span style={{ color: 'var(--accent-primary)' }}>✓</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}><strong>Scale automated workflows:</strong> Programmatically rent numbers via REST API or MCP for AI agents, QA testing, and automated signup flows.</span>
              </li>
            </ul>
          </div>
          <div className="features-grid">
            <div className="feature-box">
            <div className="feature-box-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h4>Real non-VoIP SIMs</h4>
            <p>Our numbers originate from real mobile carrier SIMs. Ensure seamless registration and high deliverability rates across global platforms.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h4>145+ global regions</h4>
            <p>Access local numbers from top-tier carriers worldwide. Ideal for regional account unlocking and localized market testing.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h4>Pay as you go</h4>
            <p>No hidden subscriptions. Browse live stock and prices freely, top up via crypto or SBP, and pay only for the numbers you actually use.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </div>
              <h4>Instant auto-refunds</h4>
              <p>Zero risk on failed deliveries. If an app doesn&apos;t send the SMS code within minutes, the activation is instantly cancelled and refunded to your balance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Physical SIM vs VoIP */}
      <section className="container" style={{ padding: "4rem 1.5rem 6rem 1.5rem" }}>
        <div className="section-header-center">
          <h2 className="section-title">Why Physical SIM Cards?</h2>
          <p className="section-subtitle">Why buyers switch from VoIP to real SIM numbers</p>
        </div>
        <div className="vs-grid">
          <div className="vs-card">
            <div className="vs-header">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>LEGACY SOLUTIONS</div>
              <div className="vs-title">VOIP NUMBERS</div>
              <div className="vs-subtitle">Virtual / online numbers</div>
            </div>
            <ul className="vs-list">
              <li className="vs-item bad">Often blocked</li>
              <li className="vs-item bad">Higher ban risk</li>
              <li className="vs-item bad">Slower delivery</li>
              <li className="vs-item bad">No long-term access</li>
              <li className="vs-item bad">Refunds vary</li>
            </ul>
          </div>
          <div className="vs-card winner">
            <div className="vs-header">
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>THE MODERN STANDARD</div>
              <div className="vs-title" style={{ color: 'var(--accent-primary)' }}>PHYSICAL SIMS</div>
              <div className="vs-subtitle" style={{ color: 'var(--accent-primary)' }}>VirtualSMS</div>
            </div>
            <ul className="vs-list">
              <li className="vs-item good">Better acceptance</li>
              <li className="vs-item good">Lower ban risk</li>
              <li className="vs-item good">Usually under 60s</li>
              <li className="vs-item good">Rent for days or months</li>
              <li className="vs-item good">Auto-refund if no SMS</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="container" style={{ padding: "4rem 1.5rem 6rem 1.5rem", background: '#f8fafc' }}>
        <div className="section-header-center">
          <h2 className="section-title">Popular Countries</h2>
          <p className="section-subtitle">Real SIM cards sourced from 145+ countries worldwide</p>
        </div>
        <div className="countries-grid">
          {[
            { name: "Germany", slug: "de", price: "$0.05" },
            { name: "Netherlands", slug: "nl", price: "$0.18" },
            { name: "United Kingdom", slug: "gb", price: "$0.20" },
            { name: "France", slug: "fr", price: "$0.22" },
            { name: "Ukraine", slug: "ua", price: "$0.05" },
            { name: "Poland", slug: "pl", price: "$0.12" },
            { name: "Czechia", slug: "cz", price: "$0.14" },
            { name: "Sweden", slug: "se", price: "$0.18" },
            { name: "United States", slug: "us", price: "$0.20" },
            { name: "Spain", slug: "es", price: "$0.18" },
            { name: "Indonesia", slug: "id", price: "$0.09" },
            { name: "Colombia", slug: "co", price: "$0.15" },
          ].map(c => (
            <Link key={c.name} href="/register" className="country-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://flagcdn.com/32x24/${c.slug.toLowerCase()}.png`} alt={c.name} className="country-flag" width={32} height={24} loading="lazy" />
              <span className="country-name">{c.name}</span>
              <span className="country-price">from {c.price}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Simple Pricing */}
      <section className="container" style={{ padding: "6rem 1.5rem" }}>
        <div className="section-header-center">
          <h2 className="section-title">Simple Pricing</h2>
          <p className="section-subtitle">Pay only for what you use. No subscriptions, no hidden fees.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div className="pricing-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <h3 className="pricing-title" style={{ marginBottom: 0 }}>Verifications</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>One-time verification code</p>
            </div>
            <div className="pricing-price">$0.05<span>/code</span></div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '2rem' }}>Starting from &bull; varies by service & country</p>
            <ul className="pricing-features">
              <li>Receive one SMS verification code</li>
              <li>Auto-refund if no code arrives</li>
              <li>145+ countries available</li>
              <li>Works with 2,500+ apps</li>
              <li>Instant delivery — usually &lt;60s</li>
            </ul>
            <Link href="/register" className="btn" style={{ width: '100%', background: '#0f172a', color: 'white' }}>
              Buy Activation &rarr;
            </Link>
          </div>
          <div className="pricing-card featured" style={{ borderTop: '4px solid var(--accent-primary)' }}>
            <div className="pricing-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <h3 className="pricing-title" style={{ marginBottom: 0 }}>Rentals</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Dedicated number, multiple SMS</p>
            </div>
            <div className="pricing-price">$3<span>/day</span></div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginBottom: '2rem' }}>Starting from &bull; varies by service & country</p>
            <ul className="pricing-features">
              <li>Dedicated real SIM number</li>
              <li>Receive unlimited SMS for duration</li>
              <li>1, 7, 30 or 90-day rentals</li>
              <li>Keep the same number to re-verify</li>
              <li>Ideal for accounts needing ongoing access</li>
            </ul>
            <Link href="/register" className="btn btn-primary" style={{ width: '100%' }}>
              Rent a Number &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* AI Agents / MCP */}
      <section className="container" style={{ padding: "2rem 1.5rem 6rem 1.5rem" }}>
        <div className="ai-section">
          <div className="ai-content">
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'white', marginBottom: '1.5rem' }}>
              <span style={{ width: '8px', height: '8px', background: 'var(--accent-tertiary)', borderRadius: '50%' }}></span>
              AVAILABLE AS AI AGENTS
            </div>
            <h2>Real-SIM SMS verification for AI agents.</h2>
            <p>One canonical endpoint for agents to receive OTP codes across 145+ countries and 2,500+ services. Pay-as-you-go via v402 USOC deposits or prepaid API keys. Real SIM cards, no VoIP.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <Link href="/docs" className="btn" style={{ background: 'white', color: '#0f172a' }}>Explore MCP Server &rarr;</Link>
              <Link href="/docs" className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Agent Docs & API</Link>
            </div>
            <div className="ai-stats">
              <div className="ai-stat">
                <div className="ai-stat-value">18</div>
                <div className="ai-stat-label">MCP TOOLS</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-value">145+</div>
                <div className="ai-stat-label">COUNTRIES</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-value">2,500+</div>
                <div className="ai-stat-label">SERVICES</div>
              </div>
              <div className="ai-stat">
                <div className="ai-stat-value">x402</div>
                <div className="ai-stat-label">USOC DEPOSITS</div>
              </div>
            </div>
          </div>
          <div className="code-window">
            <div className="code-header">
              <div className="code-dot dot-red"></div>
              <div className="code-dot dot-yellow"></div>
              <div className="code-dot dot-green"></div>
            </div>
            <div className="code-body">
{`{
  "name": "virtualsms",
  "version": "1.0.0",
  "mcp": {
    "tools": [
      "buy_number",
      "get_sms_code",
      "cancel_number"
    ]
  },
  "config": {
    "api_key": "env.VIRTUALSMS_KEY"
  }
}`}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container" style={{ padding: "4rem 1.5rem 6rem 1.5rem" }}>
        <div className="section-header-center">
          <div className="stars">★★★★★ <span style={{fontSize:'1rem', color:'#0f172a'}}>4.8</span></div>
          <h2 className="section-title">What customers say</h2>
          <p className="section-subtitle">Rated 4.8/5 by customers across Trustpilot and direct reviews.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Needed a TikTok account from a different region. Used a Lithuanian number. Code came in fast. USDT worked.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div style={{fontWeight:700}}>Nerijus</div>
                <div style={{fontSize:'0.75rem', color:'var(--text-tertiary)'}}>Lithuania</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Honestly only tried this because two other sites took my money and the WhatsApp code never showed up. These ones are real SIM cards — it just worked.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div style={{fontWeight:700}}>Inga</div>
                <div style={{fontSize:'0.75rem', color:'var(--text-tertiary)'}}>United Kingdom</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Top up with USDT, run my verifications, done. No KYC, no friction.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div style={{fontWeight:700}}>David</div>
                <div style={{fontSize:'0.75rem', color:'var(--text-tertiary)'}}>Developer</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: "4rem 1.5rem 6rem 1.5rem" }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <div style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>QUICK ANSWERS</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>What to know before you buy a number</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Direct answers for users, search engines, and AI assistants evaluating temporary real SIM numbers for SMS verification.</p>
            <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', color: '#3b82f6', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.875rem' }}>
              Ask on Telegram &rarr;
            </Link>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <details open>
                <summary className="faq-question">Are these real SIM cards or VoIP numbers?</summary>
                <div className="faq-answer">
                  VirtualSMS uses real carrier SIM numbers, not VoIP numbers from providers like Twilio or Google Voice. Real SIM routes are useful because apps such as WhatsApp, Telegram, Tinder, Google, and Instagram often reject virtual or reused VoIP numbers.
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="faq-question">How fast do SMS verification codes arrive?</summary>
                <div className="faq-answer">
                  Most SMS verification codes arrive in 30-60 seconds.
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="faq-question">Which apps and countries are supported?</summary>
                <div className="faq-answer">
                  We support 2,500+ services across 145+ countries.
                </div>
              </details>
            </div>
            <div className="faq-item">
              <details>
                <summary className="faq-question">What payment methods are accepted?</summary>
                <div className="faq-answer">
                  We accept various cryptocurrencies for frictionless top-ups.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <h2>Start Getting Verified Today</h2>
        <p>Join thousands of users who trust VirtualSMS for reliable, instant SMS verification.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/register" className="btn" style={{ background: 'white', color: 'var(--accent-primary)' }}>
            Create Free Account &rarr;
          </Link>
          <Link href="/pricing" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
            View Full Pricing
          </Link>
        </div>
      </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h4 className="footer-heading">Product</h4>
            <Link href="/services" className="footer-link">Services</Link>
            <Link href="/pricing" className="footer-link">Pricing</Link>
            <Link href="/docs" className="footer-link">API</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Resources</h4>
            <Link href="/faq" className="footer-link">FAQ</Link>
            <Link href="/docs" className="footer-link">Documentation</Link>
            <Link href="/blog" className="footer-link">Blog</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-heading">Company</h4>
            <Link href="/contact" className="footer-link">Contact</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PremiumID. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
