import { useState, useEffect } from 'react'
import { professionalApi } from '../services/api'
import type { DashboardMetrics } from '../types'

export function useDashboard(filter: string, date: string) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    professionalApi
      .get<DashboardMetrics>('/dashboard', { params: { filter, date } })
      .then((res) => setMetrics(res.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false))
  }, [filter, date])

  return { metrics, loading, error }
}