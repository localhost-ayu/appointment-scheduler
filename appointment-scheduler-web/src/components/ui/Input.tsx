import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, style, ...props }, ref) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {label && (
          <label
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={{
            width: '100%',
            height: '38px',
            padding: '0 12px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${error ? 'var(--color-error-text)' : 'var(--color-border-default)'}`,
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
            ...style,
          }}
          {...props}
        />
        {error && (
          <span style={{ fontSize: '12px', color: 'var(--color-error-text)' }}>
            {error}
          </span>
        )}
        {hint && !error && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
            {hint}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'