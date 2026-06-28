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
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="contact-field">
        <label htmlFor="contact-name" className="contact-label">Name</label>
        <input id="contact-name" name="name" type="text" placeholder="Your name" required className="input-field" />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-email" className="contact-label">Email</label>
        <input id="contact-email" name="email" type="email" placeholder="you@example.com" required className="input-field" />
      </div>
      <div className="contact-field">
        <label htmlFor="contact-subject" className="contact-label">Subject</label>
        <select id="contact-subject" name="subject" className="input-field">
          <option>General inquiry</option>
          <option>Billing / wallet issue</option>
          <option>Technical support</option>
          <option>API / developer question</option>
          <option>Account issue</option>
          <option>Report abuse</option>
        </select>
      </div>
      <div className="contact-field">
        <label htmlFor="contact-message" className="contact-label">Message</label>
        <textarea id="contact-message" name="body" rows={5} placeholder="Describe your issue or question..." required className="input-field" />
      </div>
      <button type="submit" className="btn btn-primary contact-submit" disabled={sending}>
        {sending ? 'Sending\u2026' : 'Send Message'}
      </button>
    </form>
  )
}
