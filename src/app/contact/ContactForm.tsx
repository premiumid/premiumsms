'use client'

import { useState } from 'react'
import { useToast } from '@/components/Toast'

export default function ContactForm() {
  const { success, error: toastError } = useToast()
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLSelectElement).value,
      message: (form.elements.namedItem('body') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to send message')
      }

      success('Message sent! We will respond within 24 hours.')
      form.reset()
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Name</label>
        <input id="contact-name" name="name" type="text" placeholder="Your name" required style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }} />
      </div>
      <div>
        <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Email</label>
        <input id="contact-email" name="email" type="email" placeholder="you@example.com" required style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none' }} />
      </div>
      <div>
        <label htmlFor="contact-subject" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Subject</label>
        <select id="contact-subject" name="subject" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', background: 'white' }}>
          <option>General inquiry</option>
          <option>Billing / wallet issue</option>
          <option>Technical support</option>
          <option>API / developer question</option>
          <option>Account issue</option>
          <option>Report abuse</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.375rem' }}>Message</label>
        <textarea id="contact-message" name="body" rows={5} placeholder="Describe your issue or question..." required style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', resize: 'vertical' }} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={sending} style={{ width: '100%', padding: '0.875rem' }}>
        {sending ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
