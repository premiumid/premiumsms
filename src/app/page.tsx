import Link from "next/link";
import { useTranslations } from "next-intl";
import ServicesGrid from "./ServicesGrid";
import MarketingNav from "../components/MarketingNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PremiumID — Real SIM SMS Verification",
  description: "Receive SMS verification codes instantly using real non-VoIP numbers. WhatsApp, Telegram, Google, and 2,500+ services across 145+ countries.",
};

export default function Home() {
  const t = useTranslations('HomePage');

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
              {t('heroBadge')}
            </div>
            <h1 className="hero-title">
              {t('heroTitle1')}<br />
              <span className="text-gradient">{t('heroTitle2')}</span>
            </h1>
            <p className="hero-desc">
              {t('heroDesc')}
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary">
                {t('btnPrimary')} &rarr;
              </Link>
              <Link href="/services" className="btn btn-secondary">
                {t('btnSecondary')}
              </Link>
            </div>
            <div className="hero-footnote">
              {t('heroFootnote')}
            </div>
          </div>
          <div className="hero-image">
            <div className="animate-float phone-container">
              <div className="phone-frame">
                <div className="phone-dynamic-island"></div>
                <div className="phone-screen">
                  {/* Status Bar */}
                  <div className="phone-status-bar">
                    <span className="phone-time">9:41</span>
                    <div className="phone-status-icons">
                      <svg width="15" height="11" viewBox="0 0 17 11" fill="currentColor">
                        <path d="M2 10h1v1H2v-1zm3-2h1v3H5V8zm3-3h1v6H8V5zm3-3h1v9h-1V2zm3-2h1v11h-1V0z" />
                      </svg>
                      <svg width="15" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                        <line x1="12" y1="20" x2="12.01" y2="20" />
                      </svg>
                      <svg width="20" height="11" viewBox="0 0 22 11" fill="currentColor">
                        <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" />
                        <rect x="2" y="2" width="11" height="7" rx="1.5" />
                        <path d="M20 3.5h1v4h-1z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="phone-app-header">
                    <div className="phone-avatar">P</div>
                    <div className="phone-chat-info">
                      <span className="phone-chat-name">PremiumID</span>
                      <span className="phone-chat-status">online</span>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="phone-messages">
                    <div className="hero-bubble anim-delay-1">
                      <div className="bubble-service">Snapchat</div>
                      <div className="bubble-text">Your Snapchat code is <strong>88412</strong></div>
                    </div>
                    <div className="hero-bubble anim-delay-2">
                      <div className="bubble-service">Telegram</div>
                      <div className="bubble-text">Your Telegram code is <strong>94726</strong>. Do not share this.</div>
                    </div>
                    <div className="hero-bubble anim-delay-3">
                      <div className="bubble-service">WhatsApp</div>
                      <div className="bubble-text">Your WhatsApp verification code is <strong>228-714</strong></div>
                    </div>
                  </div>

                  <div className="phone-home-indicator"></div>
                </div>
              </div>

              {/* Floating Netflix Card */}
              <div className="hero-floating-card">
                <div className="floating-card-icon">
                  <span className="netflix-n">N</span>
                </div>
                <div className="floating-card-details">
                  <div className="floating-card-title">Netflix</div>
                  <div className="floating-card-status">SMS Received</div>
                </div>
                <div className="floating-card-price">$0.15</div>
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
      <section className="container section-padding">
        <div className="section-header-center">
          <h2 className="section-title">Verify accounts on 5,000+ services globally</h2>
          <p className="section-subtitle">Trusted by users and businesses worldwide. See exactly what you&apos;ll pay before signing up.</p>
        </div>
        <ServicesGrid />
        <div className="services-footer mt-3rem">
          <Link href="/services" className="btn btn-secondary btn-pill-lg">
            View All Services &rarr;
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="container section-padding-sm">
        <div className="section-header-center">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Get verified in three simple steps</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h3>Choose App & Country</h3>
            <p>Live stock and prices ready. Pick the cheapest route that works for you.</p>
          </div>
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h3>Add Funds to Buy</h3>
            <p>Pay with crypto only when you&apos;re ready. No subscription.</p>
          </div>
          <div className="step-card">
            <div className="step-number">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h3>Receive Your Code</h3>
            <p>Codes arrive in seconds. No SMS? Your balance is refunded automatically.</p>
          </div>
        </div>
      </section>

      {/* Features Split */}
      <section className="container section-padding-sm">
        <div className="features-split">
          <div className="features-content">
            <div className="text-uppercase-label">ABOUT OUR SERVICE</div>
            <h2>What is a temporary SMS number?</h2>
            <p className="text-lg-primary">
              Ensure reliable SMS delivery with <strong>real physical SIM cards</strong>. Avoid the frustration of blocked VoIP numbers from providers like Twilio or Google Voice.
            </p>
            <ul className="flex-col-gap-3">
              <li className="flex-row-center-gap-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Clean, non-VoIP carrier routes</span>
              </li>
              <li className="flex-row-center-gap-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>145+ countries supported</span>
              </li>
              <li className="flex-row-center-gap-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Instant code delivery</span>
              </li>
            </ul>
            
            <h4 className="mt-1rem mb-1rem text-lg-primary mb-0">Common use cases</h4>
            <ul className="features-list">
              <li>
                <span className="text-accent-primary">✓</span>
                <span className="text-sm-secondary"><strong>Everyday Privacy:</strong> Keep your real phone number off public databases and avoid spam when registering for services.</span>
              </li>
              <li>
                <span className="text-accent-primary">✓</span>
                <span className="text-sm-secondary"><strong>High Deliverability:</strong> Successfully receive OTPs on platforms (WhatsApp, Telegram, Tinder) that reject VoIP numbers.</span>
              </li>
              <li>
                <span className="text-accent-primary">✓</span>
                <span className="text-sm-secondary"><strong>Developer Workflows:</strong> Programmatically rent numbers via REST API or MCP for AI agents and automated testing.</span>
              </li>
            </ul>
          </div>
          <div className="features-grid">
            <div className="feature-box">
            <div className="feature-box-icon" style={{ background: 'var(--danger-bg)' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            </div>
            <h4>Real non-VoIP SIMs</h4>
            <p>Our numbers originate from real mobile carrier SIMs. Ensure seamless registration and high deliverability rates across global platforms.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: 'var(--accent-subtle)' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h4>145+ global regions</h4>
            <p>Access local numbers from top-tier carriers worldwide. Ideal for regional account unlocking and localized market testing.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: 'var(--success-bg)' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <h4>Pay as you go</h4>
            <p>No hidden subscriptions. Browse live stock and prices freely, top up via crypto or SBP, and pay only for the numbers you actually use.</p>
          </div>
          <div className="feature-box">
            <div className="feature-box-icon" style={{ background: 'var(--warning-bg)' }}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
            </div>
              <h4>Instant auto-refunds</h4>
              <p>Zero risk on failed deliveries. If an app doesn&apos;t send the SMS code within minutes, the activation is instantly cancelled and refunded to your balance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Physical SIM vs VoIP */}
      <section className="container section-padding-lg">
        <div className="section-header-center">
          <h2 className="section-title">Why Physical SIM Cards?</h2>
          <p className="section-subtitle">Why buyers switch from VoIP to real SIM numbers</p>
        </div>
        <div className="vs-grid">
          <div className="vs-card">
            <div className="vs-header">
              <div className="text-uppercase-label-muted">LEGACY SOLUTIONS</div>
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
              <div className="text-uppercase-label-accent">THE MODERN STANDARD</div>
              <div className="vs-title text-accent-primary">PHYSICAL SIMS</div>
              <div className="vs-subtitle text-accent-primary">PremiumID</div>
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
      <section className="container section-padding-lg" style={{ background: 'var(--bg-muted)' }}>
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
      <section className="container section-padding">
        <div className="section-header-center">
          <h2 className="section-title">Simple Pricing</h2>
          <p className="section-subtitle">Pay only for what you use. No subscriptions, no hidden fees.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card border-top-yellow">
            <div className="pricing-header">
              <div className="flex-row-center-gap-2 mb-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <h3 className="pricing-title mb-0">Verifications</h3>
              </div>
              <p className="text-sm-muted">One-time verification code</p>
            </div>
            <div className="pricing-price">$0.05<span>/code</span></div>
            <p className="text-xs-muted">Starting from &bull; varies by service & country</p>
            <ul className="pricing-features">
              <li>Receive one SMS verification code</li>
              <li>Auto-refund if no code arrives</li>
              <li>145+ countries available</li>
              <li>Works with 2,500+ apps</li>
              <li>Instant delivery — usually &lt;60s</li>
            </ul>
            <Link href="/register" className="btn btn-dark-full">
              Buy Activation &rarr;
            </Link>
          </div>
          <div className="pricing-card featured border-top-accent">
            <div className="pricing-header">
              <div className="flex-row-center-gap-2 mb-2">
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                <h3 className="pricing-title mb-0">Rentals</h3>
              </div>
              <p className="text-sm-muted">Dedicated number, multiple SMS</p>
            </div>
            <div className="pricing-price">$3<span>/day</span></div>
            <p className="text-xs-muted">Starting from &bull; varies by service & country</p>
            <ul className="pricing-features">
              <li><strong className="text-primary-color">Unlimited SMS</strong> for the rental duration</li>
              <li><strong className="text-primary-color">Dedicated number</strong> exclusively yours</li>
              <li>Re-verify the same account easily</li>
              <li>1, 7, 30, or 90-day options</li>
              <li>Ideal for ongoing account security</li>
            </ul>
            <Link href="/register" className="btn btn-primary w-full">
              Rent a Number &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* AI Agents / MCP */}
      <section className="container section-padding-sm">
        <div className="ai-section">
          <div className="ai-content">
            <div className="ai-badge">
              <span className="ai-dot"></span>
              WEB DASHBOARD & API
            </div>
            <h2>Built for everyone. Powerful enough for developers.</h2>
            <p>Whether you need a single number for a quick WhatsApp registration via our simple web interface, or thousands of numbers programmatically via our REST API and AI Agents. Real SIM cards, zero friction.</p>
            <div className="flex-gap-4-mt-8">
              <Link href="/docs" className="btn btn-white">Explore MCP Server &rarr;</Link>
              <Link href="/docs" className="btn btn-glass">Agent Docs & API</Link>
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
                <div className="ai-stat-label">USDT DEPOSITS</div>
              </div>
            </div>
          </div>
          <div className="code-window">
            <div className="code-header flex-between-center">
              <div className="flex-gap-2">
                <div className="code-dot dot-red"></div>
                <div className="code-dot dot-yellow"></div>
                <div className="code-dot dot-green"></div>
              </div>
              <div className="code-tab">
                <span className="code-tab-active">MCP Config</span>
                <span className="code-tab-hover">Node.js</span>
                <span className="code-tab-hover">Python</span>
              </div>
            </div>
            <div className="code-body">
{`{
  "mcpServers": {
    "virtualsms": {
      "command": "npx",
      "args": ["-y", "@premiumid/mcp-server"],
      "env": {
        "VIRTUALSMS_API_KEY": "your_api_key_here"
      }
    }
  }
}`}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container section-padding-lg">
        <div className="section-header-center">
          <div className="stars">★★★★★ <span className="stars-rating">4.8</span></div>
          <h2 className="section-title">What customers say</h2>
          <p className="section-subtitle">Rated 4.8/5 by customers across Trustpilot and direct reviews.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Needed a TikTok account from a different region. Used a Lithuanian number. Code came in fast. USDT worked.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div className="font-bold">Nerijus</div>
                <div className="text-xs-tertiary">Lithuania</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Honestly only tried this because two other sites took my money and the WhatsApp code never showed up. These ones are real SIM cards — it just worked.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div className="font-bold">Inga</div>
                <div className="text-xs-tertiary">United Kingdom</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p className="testimonial-text">&ldquo;Top up with USDT, run my verifications, done. No KYC, no friction.&rdquo;</p>
            <div className="testimonial-author">
              <div>
                <div className="font-bold">David</div>
                <div className="text-xs-tertiary">Developer</div>
              </div>
              <div className="trustpilot-logo">✓ Trustpilot</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container section-padding-lg">
        <div className="grid-1-gap-12">
          <div className="max-w-400">
            <div className="text-uppercase-label">QUICK ANSWERS</div>
            <h2 className="text-2xl-mb-4">What to know before you buy a number</h2>
            <p className="text-secondary-mb-8">Direct answers for users, search engines, and AI assistants evaluating temporary real SIM numbers for SMS verification.</p>
            <Link href="/contact" className="btn-telegram">
              Ask on Telegram &rarr;
            </Link>
          </div>
          <div className="faq-list">
            <div className="faq-item">
              <details open>
                <summary className="faq-question">Are these real SIM cards or VoIP numbers?</summary>
                <div className="faq-answer">
                  PremiumID uses real carrier SIM numbers, not VoIP numbers from providers like Twilio or Google Voice. Real SIM routes are useful because apps such as WhatsApp, Telegram, Tinder, Google, and Instagram often reject virtual or reused VoIP numbers.
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
        <p>Join thousands of users who trust PremiumID for reliable, instant SMS verification.</p>
        <div className="flex-center-gap-4">
          <Link href="/register" className="btn btn-white text-accent-primary">
            Create Free Account &rarr;
          </Link>
          <Link href="/pricing" className="btn btn-glass">
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
