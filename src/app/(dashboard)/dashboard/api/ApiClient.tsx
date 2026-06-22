'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormattedDate from '@/components/FormattedDate'
import { useToast } from '@/components/Toast'

interface ApiKey {
  id: string
  name: string
  prefix: string
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

interface ApiClientProps {
  initialKeys: ApiKey[]
  initialWebhookUrl: string | null
}

type TabType = 'curl' | 'javascript' | 'python'

export default function ApiClient({ initialKeys, initialWebhookUrl }: ApiClientProps) {
  const router = useRouter()
  const { error: toastError } = useToast()
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl || '')
  const [isSavingWebhook, setIsSavingWebhook] = useState(false)
  const [webhookSaved, setWebhookSaved] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<TabType>('curl')

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError(null)
    setGeneratedKey(null)

    try {
      const res = await fetch('/api/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName || 'Default Key' })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create API key')

      setGeneratedKey(data.rawKey)
      setKeys([data.key, ...keys])
      setNewKeyName('')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create API key')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRevokeKey = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This cannot be undone.')) return

    try {
      const res = await fetch(`/api/developer/keys/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to revoke key')
      }

      setKeys(keys.filter(k => k.id !== id))
      router.refresh()
    } catch (err: unknown) {
      toastError(err instanceof Error ? err.message : 'Failed to revoke key')
    }
  }

  const handleSaveWebhook = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingWebhook(true)
    setError(null)
    setWebhookSaved(false)

    try {
      const res = await fetch('/api/developer/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: webhookUrl })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save webhook')

      setWebhookSaved(true)
      setTimeout(() => setWebhookSaved(false), 3000)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save webhook')
    } finally {
      setIsSavingWebhook(false)
    }
  }

  const copyToClipboard = (text: string, type: 'key' | 'code') => {
    navigator.clipboard.writeText(text)
    if (type === 'key') {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } else {
      setCopiedCode(text)
      setTimeout(() => setCopiedCode(null), 2000)
    }
  }

  const getCodeSnippet = (endpoint: string) => {
    if (activeTab === 'curl') {
      switch (endpoint) {
        case 'services':
          return `curl -X GET "https://premiumid.io/api/services" \\\n  -H "X-API-Key: YOUR_API_KEY"`
        case 'rent':
          return `curl -X POST "https://premiumid.io/api/rentals" \\\n  -H "X-API-Key: YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"service": "telegram", "country": "US"}'`
        case 'messages':
          return `curl -X GET "https://premiumid.io/api/rentals/RENTAL_ID" \\\n  -H "X-API-Key: YOUR_API_KEY"`
        default:
          return ''
      }
    }

    if (activeTab === 'javascript') {
      switch (endpoint) {
        case 'services':
          return `fetch('https://premiumid.io/api/services', {\n  headers: {\n    'X-API-Key': 'YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`
        case 'rent':
          return `fetch('https://premiumid.io/api/rentals', {\n  method: 'POST',\n  headers: {\n    'X-API-Key': 'YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ service: 'telegram', country: 'US' })\n})\n.then(res => res.json())\n.then(data => console.log(data));`
        case 'messages':
          return `fetch('https://premiumid.io/api/rentals/RENTAL_ID', {\n  headers: {\n    'X-API-Key': 'YOUR_API_KEY'\n  }\n})\n.then(res => res.json())\n.then(data => console.log(data));`
        default:
          return ''
      }
    }

    if (activeTab === 'python') {
      switch (endpoint) {
        case 'services':
          return `import requests\n\nheaders = {"X-API-Key": "YOUR_API_KEY"}\nres = requests.get("https://premiumid.io/api/services", headers=headers)\nprint(res.json())`
        case 'rent':
          return `import requests\n\nheaders = {\n    "X-API-Key": "YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\ndata = {"service": "telegram", "country": "US"}\nres = requests.post("https://premiumid.io/api/rentals", headers=headers, json=data)\nprint(res.json())`
        case 'messages':
          return `import requests\n\nheaders = {"X-API-Key": "YOUR_API_KEY"}\nres = requests.get("https://premiumid.io/api/rentals/RENTAL_ID", headers=headers)\nprint(res.json())`
        default:
          return ''
      }
    }
  }

  return (
    <div className="api-keys-container">
      <div className="api-cards">
        {/* Keys management */}
        <div className="api-card">
          <div className="api-card-header">
            <div className="api-card-icon">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            </div>
            <h2 className="api-card-title">API Keys</h2>
          </div>
          <p className="api-card-desc">Create credentials to interface with the PremiumID API programmatically.</p>

          <form onSubmit={handleCreateKey} className="mb-6">
            <label htmlFor="key-name-input" className="input-label">Key Name</label>
            <div className="input-group">
              <input
                type="text"
                id="key-name-input"
                className="input-field"
                placeholder="e.g. Production Automation"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Create Key'}
              </button>
            </div>
          </form>

          {error && (
            <div className="api-error">
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          {generatedKey && (
            <div className="generated-key-banner mb-6">
              <p className="banner-title" style={{ color: 'var(--success)', fontWeight: 700 }}>
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Copy your API Key now!
              </p>
              <p className="banner-desc">For security reasons, this key will not be shown again. Save it somewhere safe.</p>
              <div className="key-display-box">
                <code className="key-display-code">{generatedKey}</code>
                <button onClick={() => copyToClipboard(generatedKey, 'key')} className="btn btn-secondary btn-small">
                  {copiedKey ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          <div>
            <h3 className="input-label">Your Active API Keys</h3>
            {keys.length === 0 ? (
              <p className="no-results" style={{ textAlign: 'center', padding: '1rem 0' }}>No active API keys yet.</p>
            ) : (
              <div className="keys-list-items">
                {keys.map(k => (
                  <div key={k.id} className="key-item-row">
                    <div className="key-item-info">
                      <p className="key-item-name">{k.name}</p>
                      <code className="key-item-prefix">{k.prefix}...</code>
                    </div>
                    <div className="key-item-meta">
                      <span>Created: <FormattedDate date={k.created_at} type="date" /></span>
                      {k.last_used_at ? (
                        <span>Last used: <FormattedDate date={k.last_used_at} type="date" /></span>
                      ) : (
                        <span>Never used</span>
                      )}
                    </div>
                    <button onClick={() => handleRevokeKey(k.id)} className="btn btn-secondary btn-small" style={{ color: 'var(--danger)' }}>
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="api-webhook-section">
            <h3 className="api-webhook-title">Webhook Configuration</h3>
            <p className="api-webhook-desc">Receive HTTP POST requests whenever a new SMS arrives for your active rentals.</p>
            <form onSubmit={handleSaveWebhook}>
              <label htmlFor="webhook-url-input" className="input-label">Endpoint URL</label>
              <div className="input-group">
                <input
                  type="url"
                  id="webhook-url-input"
                  className="input-field"
                  placeholder="https://your-server.com/webhooks/sms"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary" disabled={isSavingWebhook}>
                  {isSavingWebhook ? 'Saving...' : webhookSaved ? 'Saved!' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Quick Docs overview */}
        <div className="api-card">
          <div className="api-card-header">
            <div className="api-card-icon">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="api-card-title">Developer Integration</h2>
          </div>
          <p className="api-card-desc">Integrate real SMS verifications directly into your codebase or tools.</p>
          <div className="api-overview-bullets">
            <div className="bullet-item" style={{ marginTop: 0 }}>
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bullet-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <div>
                <strong>Authentication</strong>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Attach your API Key to the request header as <code>X-API-Key: your_key_here</code>.</p>
              </div>
            </div>
            <div className="bullet-item">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bullet-icon"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <div>
                <strong>Rate Limits & Pricing</strong>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Requests are limited to 60 calls per minute. Standard fees apply per rental order.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full API Documentation */}
      <div className="api-docs-section">
        <h2 className="api-docs-title">API Documentation</h2>
      </div>

      <div className="api-card" style={{ marginBottom: '2rem' }}>
        <div className="docs-tabs">
          <button onClick={() => setActiveTab('curl')} className={`tab-btn ${activeTab === 'curl' ? 'active' : ''}`}>cURL</button>
          <button onClick={() => setActiveTab('javascript')} className={`tab-btn ${activeTab === 'javascript' ? 'active' : ''}`}>JavaScript</button>
          <button onClick={() => setActiveTab('python')} className={`tab-btn ${activeTab === 'python' ? 'active' : ''}`}>Python</button>
        </div>

        <div className="docs-sections" style={{ marginTop: '1.5rem' }}>
          {/* Endpoint 1 */}
          <div className="docs-endpoint-section">
            <div className="endpoint-header">
              <span className="method-badge get">GET</span>
              <code className="endpoint-path">/api/services</code>
              <span className="endpoint-desc">List available services</span>
            </div>
            <div className="endpoint-grid">
              <div className="endpoint-details">
                <p>Retrieve a list of all supported services and their internal slugs to use during rentals.</p>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Response Example</h4>
                <pre className="response-pre">
{`{
  "services": [
    { "slug": "whatsapp", "name": "WhatsApp" },
    { "slug": "telegram", "name": "Telegram" }
  ]
}`}
                </pre>
              </div>
              <div className="endpoint-code">
                <div className="code-box-header">
                  <span className="code-box-lang">{activeTab}</span>
                  <button onClick={() => copyToClipboard(getCodeSnippet('services')!, 'code')} className="copy-code-btn">
                    {copiedCode === getCodeSnippet('services') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="code-box-pre">{getCodeSnippet('services')}</pre>
              </div>
            </div>
          </div>

          {/* Endpoint 2 */}
          <div className="docs-endpoint-section">
            <div className="endpoint-header">
              <span className="method-badge post">POST</span>
              <code className="endpoint-path">/api/rentals</code>
              <span className="endpoint-desc">Rent a new number</span>
            </div>
            <div className="endpoint-grid">
              <div className="endpoint-details">
                <p>Purchase a rental phone number for a specific service and country. Deducts fees directly from your wallet balance.</p>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Parameters</h4>
                <table className="params-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>service</code></td>
                      <td>string (Required)</td>
                      <td>Slug of the service (e.g. <code>wa</code>)</td>
                    </tr>
                    <tr>
                      <td><code>country</code></td>
                      <td>string (Required)</td>
                      <td>Two-letter country code (e.g. <code>US</code>)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="endpoint-code">
                <div className="code-box-header">
                  <span className="code-box-lang">{activeTab}</span>
                  <button onClick={() => copyToClipboard(getCodeSnippet('rent')!, 'code')} className="copy-code-btn">
                    {copiedCode === getCodeSnippet('rent') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="code-box-pre">{getCodeSnippet('rent')}</pre>
              </div>
            </div>
          </div>

          {/* Endpoint 3 */}
          <div className="docs-endpoint-section" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
            <div className="endpoint-header">
              <span className="method-badge get">GET</span>
              <code className="endpoint-path">/api/rentals/:id</code>
              <span className="endpoint-desc">Get rental details + received messages</span>
            </div>
            <div className="endpoint-grid">
              <div className="endpoint-details">
                <p>Poll this endpoint to retrieve rental details and incoming SMS messages for a specific active rental.</p>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Response Example</h4>
                <pre className="response-pre">
{`{
  "messages": [
    {
      "id": "msg_98234",
      "sender": "WhatsApp",
      "text": "Your WhatsApp code is: 128-493",
      "code": "128493",
      "received_at": "2026-06-15T05:30:00Z"
    }
  ]
}`}
                </pre>
              </div>
              <div className="endpoint-code">
                <div className="code-box-header">
                  <span className="code-box-lang">{activeTab}</span>
                  <button onClick={() => copyToClipboard(getCodeSnippet('messages')!, 'code')} className="copy-code-btn">
                    {copiedCode === getCodeSnippet('messages') ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="code-box-pre">{getCodeSnippet('messages')}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
