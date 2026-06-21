import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — PremiumID",
  description: "Insights on SMS verification, privacy, and our updates.",
};

export default function BlogPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Our Blog</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem' }}>
        Insights on SMS verification, privacy, and our updates.
      </p>
      <div style={{ background: 'var(--bg-muted)', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
        <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Coming Soon</h2>
        <p style={{ color: 'var(--text-muted)' }}>We are preparing some interesting articles for you. Stay tuned!</p>
      </div>
    </div>
  )
}
