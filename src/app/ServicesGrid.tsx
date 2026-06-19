'use client'

import { useState } from 'react'
import Link from 'next/link'
import ServiceIcon from '../components/ServiceIcon'

const SERVICES = [
  { name: 'Telegram', slug: 'telegram', price: '$0.05', color: '#2AABEE' },
  { name: 'WhatsApp', slug: 'whatsapp', price: '$0.08', color: '#25D366' },
  { name: 'Google', slug: 'google', price: '$0.05', color: '#EA4335' },
  { name: 'Facebook', slug: 'facebook', price: '$0.09', color: '#1877F2' },
  { name: 'Instagram', slug: 'instagram', price: '$0.06', color: '#E4405F' },
  { name: 'Twitter/X', slug: 'x', price: '$0.05', color: '#000000' },
  { name: 'TikTok', slug: 'tiktok', price: '$0.05', color: '#000000' },
  { name: 'Discord', slug: 'discord', price: '$0.05', color: '#5865F2' },
  { name: 'Netflix', slug: 'netflix', price: '$0.09', color: '#E50914' },
  { name: 'Spotify', slug: 'spotify', price: '$0.18', color: '#1DB954' },
  { name: 'Uber', slug: 'uber', price: '$0.06', color: '#000000' },
  { name: 'PayPal', slug: 'paypal', price: '$0.15', color: '#00457C' },
  { name: 'Viber', slug: 'viber', price: '$0.05', color: '#7360F2' },
  { name: 'LINE', slug: 'line', price: '$0.05', color: '#00C300' },
  { name: 'Binance', slug: 'binance', price: '$0.24', color: '#F3BA2F' },
  { name: 'Apple', slug: 'apple', price: '$0.05', color: '#000000' },
  { name: 'Coinbase', slug: 'coinbase', price: '$0.21', color: '#0052FF' },
  { name: 'Steam', slug: 'steam', price: '$0.06', color: '#000000' },
 ]

export default function ServicesGrid() {
  const [search, setSearch] = useState('')

  const filtered = SERVICES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div style={{ maxWidth: '600px', margin: '0 auto 3rem auto' }}>
        <input
          type="text"
          placeholder="Search Telegram, WhatsApp, Google..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            outline: 'none',
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          }}
        />
      </div>
      <div className="services-grid">
        {filtered.map(s => (
          <Link key={s.name} href="/register" className="service-card">
            <ServiceIcon slug={s.slug} color={s.color} name={s.name} />
            <span className="service-card-name">{s.name}</span>
            <span className="service-card-price">from {s.price}</span>
          </Link>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <p>No services match your search. Try a different term.</p>
        </div>
      )}
    </>
  )
}
