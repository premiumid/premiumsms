import Link from 'next/link'
import MarketingNav from '../../components/MarketingNav'

export const metadata = {
  title: 'API Documentation — PremiumID',
  description: 'REST API and MCP integration docs for PremiumID SMS verification.',
}

const endpoints = [
  {
    method: 'GET',
    path: '/api/services',
    desc: 'List all available services.',
    response: '{ services: [{ slug, name, icon_url }] }',
  },
  {
    method: 'GET',
    path: '/api/countries?service=telegram',
    desc: 'List countries for a service (optional filter).',
    response: '{ countries: [{ code, name, flag }] }',
  },
  {
    method: 'POST',
    path: '/api/rentals',
    desc: 'Create a rental. Deducts from wallet.',
    body: '{ "service": "telegram", "country": "US" }',
    response: '{ rental: { id, phone_number, status, expires_at, price } }',
  },
  {
    method: 'GET',
    path: '/api/rentals',
    desc: 'List your rentals (last 20).',
    response: '{ rentals: [...] }',
  },
  {
    method: 'GET',
    path: '/api/rentals/:id',
    desc: 'Get rental details + SMS messages. Polls provider.',
    response: '{ rental: {...}, messages: [{ text, sender, received_at }] }',
  },
  {
    method: 'POST',
    path: '/api/rentals/:id',
    desc: 'Cancel a rental. Refunds to wallet.',
    response: '{ success: true }',
  },
]

const curlExample = `curl https://premiumid.io/api/rentals \\
  -H "X-API-Key: pk_live_your_key_here"`

const jsExample = `const res = await fetch('https://premiumid.io/api/rentals', {
  method: 'POST',
  headers: {
    'X-API-Key': 'pk_live_your_key_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ service: 'telegram', country: 'US' }),
})
const { rental } = await res.json()
console.log(rental.phone_number) // +1xxxxxxxxx`

const pythonExample = `import requests

res = requests.post(
    'https://premiumid.io/api/rentals',
    headers={'X-API-Key': 'pk_live_your_key_here'},
    json={'service': 'telegram', 'country': 'US'}
)
rental = res.json()['rental']
print(rental['phone_number'])`

export default function DocsPage() {
  return (
    <div>
      <MarketingNav />

      {/* Hero */}
      <section className="hero-wrapper" style={{ paddingBottom: '6rem' }}>
        <div className="container">
          <div className="hero-badge">REST API + MCP</div>
          <h1 className="hero-title">Developer Docs</h1>
          <p className="hero-desc">
            Automate SMS verification in your apps with our simple REST API. Authenticate with an API key — no OAuth required.
          </p>
          <div className="hero-actions">
            <Link href="/register" className="btn btn-primary">Get an API Key</Link>
            <Link href="/dashboard/api" className="btn btn-secondary" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              Manage Keys
            </Link>
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 1.5rem 6rem', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Sidebar */}
        <nav style={{ position: 'sticky', top: '1rem' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['Authentication', 'Rate Limits', 'Endpoints', 'Code Examples', 'MCP Integration'].map(s => (
              <li key={s}>
                <a href={`#${s.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', padding: '0.25rem 0' }}>
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

          {/* Authentication */}
          <section id="authentication">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Authentication</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              All API endpoints accept either a session cookie (browser) or an <code>X-API-Key</code> header (programmatic access).
            </p>
            <div style={{ background: 'var(--bg-muted)', color: 'var(--text)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
              X-API-Key: pk_live_xxxxxxxxxxxxxxxxxxxxxxxx
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Generate your key in <Link href="/dashboard/api">Dashboard → API Keys</Link>. Keys are shown once at creation — store them securely.
            </p>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Rate Limits</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              60 requests per minute per API key (or session). Exceeding this returns <code>429 Too Many Requests</code> with a <code>Retry-After: 60</code> header.
            </p>
          </section>

          {/* Endpoints */}
          <section id="endpoints">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Endpoints</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {endpoints.map(ep => (
                <div key={`${ep.method}-${ep.path}`} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ background: ep.method === 'GET' ? 'var(--accent-subtle)' : 'var(--success-bg)', color: ep.method === 'GET' ? 'var(--accent)' : 'var(--success)', fontSize: '0.75rem', fontWeight: 700, padding: '0.125rem 0.5rem', borderRadius: '4px', fontFamily: 'monospace' }}>
                      {ep.method}
                    </span>
                    <code style={{ fontSize: '0.875rem', fontWeight: 600 }}>{ep.path}</code>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: ep.body ? '0.5rem' : 0 }}>{ep.desc}</p>
                  {ep.body && (
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Body: </span>
                      <code style={{ fontSize: '0.8rem' }}>{ep.body}</code>
                    </div>
                  )}
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Response: </span>
                    <code style={{ fontSize: '0.8rem' }}>{ep.response}</code>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Code Examples */}
          <section id="code-examples">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem' }}>Code Examples</h2>
            {[['cURL', curlExample], ['JavaScript', jsExample], ['Python', pythonExample]].map(([lang, code]) => (
              <div key={lang} style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>{lang}</h3>
                <pre style={{ background: 'var(--bg-muted)', color: 'var(--text)', padding: '1.25rem', borderRadius: 'var(--radius-md)', overflowX: 'auto', fontSize: '0.8125rem', lineHeight: 1.6, border: '1px solid var(--border)' }}>
                  <code>{code}</code>
                </pre>
              </div>
            ))}
          </section>

          {/* MCP */}
          <section id="mcp-integration">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>MCP Integration</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              PremiumID supports the <strong>Model Context Protocol (MCP)</strong>, letting AI assistants like Claude directly rent numbers, poll for codes, and cancel rentals on your behalf.
            </p>
            <div style={{ background: 'var(--bg-muted)', color: 'var(--text)', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.8125rem', lineHeight: 1.6, border: '1px solid var(--border)' }}>
              {`// Claude Desktop config (~/.claude/claude_desktop_config.json)\n{\n  "mcpServers": {\n    "premiumid": {\n      "url": "https://premiumid.io/api/mcp",\n      "headers": { "X-API-Key": "pk_live_..." }\n    }\n  }\n}`}
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              See the in-dashboard MCP tab for your personal config snippet.
            </p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} PremiumID. &nbsp;|&nbsp;{' '}
          <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy</Link> &nbsp;|&nbsp;{' '}
          <Link href="/terms" style={{ color: 'var(--text-muted)' }}>Terms</Link>
        </p>
      </footer>
    </div>
  )
}
