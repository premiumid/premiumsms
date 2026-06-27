'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

function subscribeCookieConsent(onStoreChange: () => void) {
  window.addEventListener('cookie-consent-change', onStoreChange)
  return () => window.removeEventListener('cookie-consent-change', onStoreChange)
}

export default function CookieConsent() {
  const visible = useSyncExternalStore(
    subscribeCookieConsent,
    () => !localStorage.getItem('cookie-consent'),
    () => false,
  )

  function accept() {
    localStorage.setItem('cookie-consent', 'true')
    window.dispatchEvent(new Event('cookie-consent-change'))
  }

  if (!visible) return null

  return (
    <div className="cookie-consent" role="alert">
      <p>
        We use essential cookies to operate this site. By continuing, you accept our{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <button className="btn btn-primary cookie-consent-btn" onClick={accept}>
        Accept
      </button>
      <style>{`
        .cookie-consent {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9998;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 1.5rem;
          background: var(--text);
          color: white;
          font-size: 0.8125rem;
          line-height: 1.4;
          box-shadow: var(--shadow-md);
        }
        .cookie-consent a {
          color: var(--accent-muted);
          text-decoration: underline;
        }
        .cookie-consent-btn {
          flex-shrink: 0;
          font-size: 0.75rem;
          padding: 0.75rem 1.25rem;
          min-height: 44px;
        }
        @media (max-width: 640px) {
          .cookie-consent {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
