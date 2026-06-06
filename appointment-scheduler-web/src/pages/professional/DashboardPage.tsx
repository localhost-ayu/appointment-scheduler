import { useSearchParams } from 'react-router-dom'
import { useDashboard } from '../../hooks/useDashboard'
import { useProfessionalAppointments } from '../../hooks/useProfessionalAppointments'
import { DashboardHeader } from '../../components/professional/DashboardHeader'
import { MetricsGrid } from '../../components/professional/MetricsGrid'
import { AppointmentTable } from '../../components/professional/AppointmentTable'
import { Card, CardHeader, CardTitle } from '../../components/ui'

const FILTERS = ['day', 'week', 'month', 'year'] as const
type Filter = typeof FILTERS[number]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

function todayString() {
  return new Date().toISOString().split('T')[0]
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const filter = (searchParams.get('filter') ?? 'day') as Filter
  const date = searchParams.get('date') ?? todayString()
  const status = searchParams.get('status') ?? 'all'

  const { metrics, loading: metricsLoading } = useDashboard(filter, date)
  const { appointments, loading: aptsLoading, refetch } = useProfessionalAppointments(filter, date, status)

  const setFilter = (f: Filter) => setSearchParams({ filter: f, date: todayString(), status })
  const setStatus = (s: string) => setSearchParams({ filter, date, status: s })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-base)' }}>
      <DashboardHeader />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '32px' }}>
        <div className="flex flex-col gap-8">

          {/* Page title + filter tabs */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                Dashboard
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                {new Date().toLocaleDateString('en-GB', {
                  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                })}
              </p>
            </div>

            {/* Filter tabs */}
            <div style={{
              display: 'flex',
              gap: '2px',
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
            }}>
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 'calc(var(--radius-md) - 2px)',
                    fontSize: '13px',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    backgroundColor: filter === f ? 'var(--color-bg-surface)' : 'transparent',
                    color: filter === f ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    boxShadow: filter === f ? 'var(--shadow-raised)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          {metricsLoading ? (
            <div style={{ fontSize: '13px', color: 'var(--color-text-tertiary)' }}>
              Loading metrics...
            </div>
          ) : metrics ? (
            <MetricsGrid metrics={metrics} filter={filter} />
          ) : null}

          {/* Appointments */}
          <Card padding="none">
            <CardHeader>
              <CardTitle>Appointments</CardTitle>

              {/* Status filter */}
              <div style={{
                display: 'flex',
                gap: '2px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
              }}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 'calc(var(--radius-md) - 2px)',
                      fontSize: '12px',
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: status === opt.value ? 'var(--color-bg-surface)' : 'transparent',
                      color: status === opt.value ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      boxShadow: status === opt.value ? 'var(--shadow-raised)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardHeader>

            <AppointmentTable
              appointments={appointments}
              loading={aptsLoading}
              onRefetch={refetch}
            />
          </Card>

        </div>
      </div>
    </div>
  )
}