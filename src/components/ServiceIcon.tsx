'use client'

import { useState } from 'react'

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

export function getServiceColor(slug: string): string {
  return BG_COLORS[slug.toLowerCase()] || '#0f172a'
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
  const color = getServiceColor(slug)

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
          src={`https://cdn.simpleicons.org/${slug}/ffffff`}
          alt={name}
          width={iconSize}
          height={iconSize}
          onError={() => setFailed(true)}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      )}
      {failed && (
        <span style={{ color: 'white', fontWeight: 'bold', fontSize: `${Math.round(size * 0.375)}px`, lineHeight: 1 }}>
          {name[0]}
        </span>
      )}
    </div>
  )
}
