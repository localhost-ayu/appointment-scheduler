type Status = 'pending' | 'completed' | 'cancelled'

interface StatusBadgeProps {
  status: Status
}

const styles: Record<Status, { bg: string; text: string; border: string }> = {
  pending: {
    bg: 'var(--color-warning-bg)',
    text: 'var(--color-warning-text)',
    border: 'var(--color-warning-border)',
  },
  completed: {
    bg: 'var(--color-success-bg)',
    text: 'var(--color-success-text)',
    border: 'var(--color-success-border)',
  },
  cancelled: {
    bg: 'var(--color-error-bg)',
    text: 'var(--color-error-text)',
    border: 'var(--color-error-border)',
  },
}

const labels: Record<Status, string> = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const s = styles[status]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        border: `1px solid ${s.border}`,
        backgroundColor: s.bg,
        color: s.text,
        fontSize: '12px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {labels[status]}
    </span>
  )
}