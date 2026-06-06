import type { DashboardMetrics } from '../../types'

interface MetricsGridProps {
  metrics: DashboardMetrics
  filter: string
}

interface MetricCardProps {
  label: string
  value: string | number
  accent: string
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border-default)',
      boxShadow: 'var(--shadow-raised)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      borderLeft: `3px solid ${accent}`,
    }}>
      <p style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--color-text-secondary)',
        margin: '0 0 8px',
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '28px',
        fontWeight: 600,
        color: 'var(--color-text-primary)',
        margin: 0,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}>
        {value}
      </p>
    </div>
  )
}

export function MetricsGrid({ metrics, filter }: MetricsGridProps) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

  return (
    <div className="flex flex-col gap-6">

      {/* Today */}
      <div>
        <p style={{
          fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
          margin: '0 0 12px',
        }}>
          Today
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Total" value={metrics.today.total} accent="var(--color-border-strong)" />
          <MetricCard label="Pending" value={metrics.today.pending} accent="var(--color-warning-text)" />
          <MetricCard label="Completed" value={metrics.today.completed} accent="var(--color-success-text)" />
          <MetricCard label="Revenue" value={fmt(metrics.today.revenue)} accent="var(--color-action-primary)" />
        </div>
      </div>

      {/* Period — only show when filter is not day */}
      {filter !== 'day' && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 500, letterSpacing: '0.06em',
            textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
            margin: '0 0 12px', textTransform: 'uppercase' as any,
          }}>
            This {filter}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard label="Total" value={metrics.total} accent="var(--color-border-strong)" />
            <MetricCard label="Pending" value={metrics.pending} accent="var(--color-warning-text)" />
            <MetricCard label="Completed" value={metrics.completed} accent="var(--color-success-text)" />
            <MetricCard
              label="Revenue"
              value={fmt(metrics.revenue)}
              accent="var(--color-action-primary)"
            />
          </div>
        </div>
      )}

    </div>
  )
}