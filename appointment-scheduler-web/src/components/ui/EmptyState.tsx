import { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

const defaultIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{
        padding: '48px 24px',
        color: 'var(--color-text-tertiary)',
      }}
    >
      <div style={{ marginBottom: '12px', opacity: 0.5 }}>
        {icon ?? defaultIcon}
      </div>
      <p style={{
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
        margin: '0 0 4px',
      }}>
        {title}
      </p>
      {description && (
        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-tertiary)',
          margin: '0 0 16px',
          maxWidth: '280px',
        }}>
          {description}
        </p>
      )}
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}