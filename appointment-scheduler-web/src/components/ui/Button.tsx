import { ReactNode, CSSProperties } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  style?: CSSProperties
}

const base: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'inherit',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease',
  whiteSpace: 'nowrap',
}

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--color-action-primary)',
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: 'var(--color-bg-subtle)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-default)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--color-action-primary-text)',
  },
  destructive: {
    backgroundColor: 'transparent',
    color: 'var(--color-error-text)',
  },
}

const sizes: Record<ButtonSize, CSSProperties> = {
  sm: {
    height: '30px',
    padding: '0 12px',
    fontSize: '13px',
    borderRadius: 'var(--radius-sm)',
  },
  md: {
    height: '38px',
    padding: '0 16px',
    fontSize: '14px',
    borderRadius: 'var(--radius-md)',
  },
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...base,
        ...variants[variant],
        ...sizes[size],
        ...(fullWidth ? { width: '100%' } : {}),
        ...(disabled || loading ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
        ...style,
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}