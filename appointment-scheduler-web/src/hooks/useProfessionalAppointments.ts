import { useState, useEffect, useCallback } from 'react'
import { professionalApi } from '../services/api'
import type { Appointment } from '../types'

export function useProfessionalAppointments(filter: string, date: string, status: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setLoading(true)
    setError(null)

    const params: Record<string, string> = { filter, date }
    if (status !== 'all') params.status = status

    professionalApi
      .get<{ data: Appointment[] }>('/appointments', { params })
      .then((res) => setAppointments(res.data.data))
      .catch(() => setError('Failed to load appointments.'))
      .finally(() => setLoading(false))
  }, [filter, date, status])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { appointments, loading, error, refetch: fetch }
}