'use client'

import { useState, useEffect, useRef } from 'react'

const BG_COLORS: Record<string, string> = {
  telegram: '#2AABEE', whatsapp: '#25D366', instagram: '#E4405F',
  facebook: '#1877F2', tiktok: '#000000', google: '#EA4335',
  twitter: '#000000', discord: '#5865F2', netflix: '#E50914',
  spotify: '#1DB954', steam: '#1b2838', amazon: '#FF9900',
  uber: '#000000', paypal: '#00457C', binance: '#F3BA2F',
  coinbase: '#0052FF', tinder: '#FF6B6B', signal: '#3A76F0',
  wechat: '#07C160', viber: '#7360F2', line: '#00B900',
  snapchat: '#FFFC00', microsoft: '#00A4EF', apple: '#A2AAAD',
}

const FALLBACK_PALETTE = [
  '#4f46e5', '#2563eb', '#099268', '#0c8599', 
  '#1864ab', '#5c7cfa', '#7048e8', '#ae3ec9', 
  '#d6336c', '#f03e3e', '#f59f00', '#37b24d'
]

export function getServiceColor(slug: string): string {
  const normalized = slug.toLowerCase()
  if (BG_COLORS[normalized]) {
    return BG_COLORS[normalized]
  }
  // Deterministic hash based on slug
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % FALLBACK_PALETTE.length
  return FALLBACK_PALETTE[index]
}

interface ServiceIconProps {
  slug: string
  name: string
  size?: number
  iconSize?: number
  rounded?: boolean
}

export default function ServiceIcon({ slug, name, size = 48, iconSize = 28, rounded = true }: ServiceIconProps) {
  const [failed, setFailed] = useState(!slug)
  const imgRef = useRef<HTMLImageElement>(null)
  const color = getServiceColor(slug)

  // Robust hydration check to see if image failed to load before JS hydrated
  useEffect(() => {
    if (imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth === 0) {
        setFailed(true)
      }
    }
  }, [slug])

  // Get Initials: first letter uppercase
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  const fontSize = size <= 24 ? '11px' : `${Math.round(size * 0.38)}px`

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: rounded ? '12px' : `${size / 6}px`,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {!failed && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={`https://cdn.simpleicons.org/${slug}/ffffff`}
          alt="" // Keep alt empty so browser doesn't render ugly clipped text on failure
          width={iconSize}
          height={iconSize}
          onError={() => setFailed(true)}
          style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
        />
      )}
      {failed && (
        <span style={{ color: 'white', fontWeight: 'bold', fontSize, lineHeight: 1 }}>
          {initial}
        </span>
      )}
    </div>
  )
}

