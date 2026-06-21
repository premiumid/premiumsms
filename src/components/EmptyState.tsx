'use client'

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-faint)' }}>
      {icon && <div style={{ marginBottom: '1rem', opacity: 0.5 }}>{icon}</div>}
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{title}</p>
      {description && <p style={{ fontSize: '0.875rem', maxWidth: 360, margin: '0 auto 1.5rem', lineHeight: 1.5 }}>{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
