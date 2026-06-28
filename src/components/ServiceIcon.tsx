'use client'

import { useState, useEffect, useRef } from 'react'

const BRAND_COLORS: Record<string, string> = {
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

export function getSimpleIconSlug(slug: string, name: string): string {
  const nameLower = name.toLowerCase().trim()
  
  const nameMapping: Record<string, string> = {
    'whatsapp': 'whatsapp',
    'telegram': 'telegram',
    'instagram': 'instagram',
    'facebook': 'facebook',
    'tiktok': 'tiktok',
    'google': 'google',
    'twitter': 'x',
    'twitter/x': 'x',
    'twitter / x': 'x',
    'x (twitter)': 'x',
    'discord': 'discord',
    'microsoft': 'microsoft',
    'amazon': 'amazon',
    'netflix': 'netflix',
    'spotify': 'spotify',
    'uber': 'uber',
    'paypal': 'paypal',
    'linkedin': 'linkedin',
    'snapchat': 'snapchat',
    'twitch': 'twitch',
    'steam': 'steam',
    'apple': 'apple',
    'binance': 'binance',
    'coinbase': 'coinbase',
    'tinder': 'tinder',
    'signal': 'signal',
    'wechat': 'wechat',
    'viber': 'viber',
    'line': 'line',
    'airbnb': 'airbnb',
  }

  if (nameMapping[nameLower]) {
    return nameMapping[nameLower]
  }

  return ''
}

function getBrandColor(slug: string): string {
  const normalized = slug.toLowerCase()
  if (BRAND_COLORS[normalized]) {
    return BRAND_COLORS[normalized]
  }
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
  iconUrl?: string
  size?: number
  iconSize?: number
}

export default function ServiceIcon({ slug, name, iconUrl, size = 48, iconSize = 28 }: ServiceIconProps) {
  const cleanSlug = getSimpleIconSlug(slug, name)
  const iconSrc = iconUrl
    ? (iconUrl.startsWith('/') ? `https://virtualsms.io${iconUrl}` : iconUrl)
    : cleanSlug
      ? `https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${cleanSlug}.svg`
      : ''
  const [imageFailed, setImageFailed] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const color = getBrandColor(cleanSlug || slug)
  const failed = !iconSrc || imageFailed

  useEffect(() => {
    if (iconSrc && imgRef.current) {
      if (imgRef.current.complete && imgRef.current.naturalWidth === 0) {
        setImageFailed(true)
      }
    }
  }, [iconSrc])

  return (
    <div
      className="flex items-center justify-center overflow-hidden shrink-0"
      style={{ width: size, height: size }}
    >
      {!failed && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          ref={imgRef}
          src={iconSrc}
          alt=""
          width={iconSize}
          height={iconSize}
          onError={() => setImageFailed(true)}
          className="max-w-full max-h-full block"
        />
      )}
      {failed && (
        <span className="font-bold leading-none" style={{ fontSize: `${Math.round(size * 0.38)}px`, color }}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </span>
      )}
    </div>
  )
}

