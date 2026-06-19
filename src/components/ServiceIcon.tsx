'use client'

import { useState } from 'react'

interface ServiceIconProps {
  slug: string
  color: string
  name: string
  size?: number
  iconSize?: number
  rounded?: boolean
}

export default function ServiceIcon({ slug, color, name, size = 48, iconSize = 28, rounded = true }: ServiceIconProps) {
  const [failed, setFailed] = useState(!slug)

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
