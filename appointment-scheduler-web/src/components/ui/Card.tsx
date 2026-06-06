import { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  style?: CSSProperties
}

const paddingMap = {
  none: '0',
  sm: '16px',
  md: '20px 24px',
  lg: '24px 32px',
}

export function Card({ children, padding = 'md', className = '', style }: CardProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        boxShadow: 'var(--shadow-raised)',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between ${className}`}
      style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--color-border-default)',
      }}
    >
      {children}
    </div>
  )
}

interface CardTitleProps {
  children: ReactNode
}

export function CardTitle({ children }: CardTitleProps) {
  return (
    <h2
      style={{
        fontSize: '14px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: 0,
      }}
    >
      {children}
    </h2>
  )
}