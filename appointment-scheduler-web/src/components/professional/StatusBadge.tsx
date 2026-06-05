interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'cancelled'
}

const styles = {
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const labels = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}