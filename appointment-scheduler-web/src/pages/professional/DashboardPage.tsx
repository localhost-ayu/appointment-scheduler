import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { professionalApi } from '../../services/api'
import { useDashboard } from '../../hooks/useDashboard'
import { useProfessionalAppointments } from '../../hooks/useProfessionalAppointments'
import { MetricCard } from '../../components/professional/MetricCard'
import { AppointmentTable } from '../../components/professional/AppointmentTable'

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
  const { professional, logout } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const filter = (searchParams.get('filter') ?? 'day') as Filter
  const date = searchParams.get('date') ?? todayString()
  const status = searchParams.get('status') ?? 'all'

  const { metrics, loading: metricsLoading } = useDashboard(filter, date)
  const { appointments, loading: aptsLoading, refetch } = useProfessionalAppointments(filter, date, status)

  const setFilter = (f: Filter) => {
    setSearchParams({ filter: f, date: todayString(), status })
  }

  const setStatus = (s: string) => {
    setSearchParams({ filter, date, status: s })
  }

  const handleLogout = async () => {
    try {
      await professionalApi.post('/logout')
    } catch {
      // proceed regardless
    } finally {
      logout()
      navigate('/professional/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{professional?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Metrics */}
        {metricsLoading ? (
          <div className="text-sm text-gray-400">Loading metrics...</div>
        ) : metrics ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                Today
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Total" value={metrics.today.total} accent="gray" />
                <MetricCard label="Pending" value={metrics.today.pending} accent="yellow" />
                <MetricCard label="Completed" value={metrics.today.completed} accent="green" />
                <MetricCard
                  label="Revenue"
                  value={`R$ ${metrics.today.revenue.toFixed(2)}`}
                  accent="blue"
                />
              </div>
            </div>

            {filter !== 'day' && (
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3 capitalize">
                  This {filter}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Total" value={metrics.total} accent="gray" />
                  <MetricCard label="Pending" value={metrics.pending} accent="yellow" />
                  <MetricCard label="Completed" value={metrics.completed} accent="green" />
                  <MetricCard
                    label="Revenue"
                    value={`R$ ${metrics.revenue.toFixed(2)}`}
                    accent="blue"
                    sublabel="completed only"
                  />
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Appointment table */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Appointments</h2>
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    status === opt.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <AppointmentTable
            appointments={appointments}
            loading={aptsLoading}
            onRefetch={refetch}
          />
        </div>

      </div>
    </div>
  )
}