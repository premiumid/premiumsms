'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'

interface Step {
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; href: string }
}

const steps: Step[] = [
  {
    icon: (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Welcome to PremiumID',
    description: 'Your one-stop service for receiving SMS verification codes using real, non-VoIP phone numbers. Here\'s a quick tour to get you started.',
  },
  {
    icon: (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: '1. Top Up Your Wallet',
    description: 'Add funds to your wallet using USDT (TRC-20). Minimum top-up is $12. Your balance is used to pay for each number rental.',
    action: { label: 'Go to Wallet', href: '/dashboard/wallet' },
  },
  {
    icon: (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
    title: '2. Rent a Number',
    description: 'Browse 2,500+ services across 145+ countries. Pick a service (WhatsApp, Telegram, Google…), choose a country, and rent a number in seconds.',
    action: { label: 'Browse Numbers', href: '/dashboard/numbers' },
  },
  {
    icon: (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="9" y1="11" x2="15" y2="11"/>
      </svg>
    ),
    title: '3. Receive Your SMS',
    description: 'Once rented, use the number to request a verification code. We\'ll automatically detect incoming SMS and display the code in your dashboard.',
    action: { label: 'View My Rentals', href: '/dashboard/rentals' },
  },
  {
    icon: (
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'You\'re All Set!',
    description: 'You now know the basics. If you ever run into issues, check our FAQ or contact support. Happy renting!',
  },
]

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.location.search.includes('welcome=true')) return true
    return !localStorage.getItem('onboarding-complete')
  })
  const [currentStep, setCurrentStep] = useState(0)

  const close = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem('onboarding-complete', 'true')
  }, [])

  const next = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      close()
    }
  }, [currentStep, close])

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(s => s - 1)
  }, [currentStep])

  const skip = useCallback(() => {
    close()
  }, [close])

  if (!isOpen) return null

  const step = steps[currentStep]
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  return (
    <div className="onboarding-overlay" onClick={skip}>
      <div className="onboarding-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Onboarding tour">
        <div className="onboarding-step-indicator">
          {steps.map((_, i) => (
            <div key={i} className={`onboarding-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`} />
          ))}
        </div>

        <div className="onboarding-icon">{step.icon}</div>
        <h2 className="onboarding-title">{step.title}</h2>
        <p className="onboarding-desc">{step.description}</p>

        {step.action && (
          <Link href={step.action.href} className="btn btn-primary onboarding-action" onClick={close}>
            {step.action.label} →
          </Link>
        )}

        <div className="onboarding-nav">
          {!isFirst ? (
            <button className="btn btn-secondary" onClick={prev}>← Back</button>
          ) : <div />}
          <button className="btn btn-primary" onClick={next}>
            {isLast ? 'Get Started' : 'Continue →'}
          </button>
        </div>

        <button className="onboarding-skip" onClick={skip}>Skip tour</button>
      </div>

      <style>{`
        .onboarding-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          padding: 1rem;
        }
        .onboarding-modal {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2.5rem 2rem;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          animation: onboarding-fade-in 0.3s ease-out;
          position: relative;
        }
        @keyframes onboarding-fade-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .onboarding-step-indicator {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .onboarding-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border-color);
          transition: all 0.3s;
        }
        .onboarding-dot.active {
          width: 24px;
          border-radius: 4px;
          background: var(--accent-primary);
        }
        .onboarding-dot.done {
          background: var(--accent-tertiary);
        }
        .onboarding-icon {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
        }
        .onboarding-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
        }
        .onboarding-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .onboarding-action {
          margin-bottom: 1.5rem;
          width: 100%;
        }
        .onboarding-nav {
          display: flex;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .onboarding-nav .btn {
          flex: 1;
        }
        .onboarding-skip {
          background: none;
          border: none;
          color: var(--text-tertiary);
          font-size: 0.75rem;
          cursor: pointer;
          margin-top: 1rem;
          padding: 0.25rem;
          text-decoration: underline;
        }
        .onboarding-skip:hover {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  )
}
