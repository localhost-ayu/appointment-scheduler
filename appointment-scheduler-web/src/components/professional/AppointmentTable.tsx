import { useState } from 'react'
import { professionalApi } from '../../services/api'
import { StatusBadge } from './StatusBadge'
import type { Appointment } from '../../types'

interface AppointmentTableProps {
  appointments: Appointment[]
  loading: boolean
  onRefetch: () => void
}

export function AppointmentTable({ appointments, loading, onRefetch }: AppointmentTableProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const handleComplete = async (appointmentNumber: string) => {
    setActionLoading(appointmentNumber + '-complete')
    try {
      await professionalApi.post(`/appointments/${appointmentNumber}/complete`)
      onRefetch()
    } catch {
      alert('Failed to complete appointment.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async (appointmentNumber: string) => {
    if (! confirm('Cancel this appointment?')) return
    setActionLoading(appointmentNumber + '-cancel')
    try {
      await professionalApi.post(`/appointments/${appointmentNumber}/cancel`)
      onRefetch()
    } catch {
      alert('Failed to cancel appointment.')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        Loading appointments...
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
        No appointments found for this period.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Number</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Service</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Time</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {appointments.map((apt) => {
            const { date, time } = formatDateTime(apt.starts_at)
            const isPending = apt.status === 'pending'
            return (
              <tr key={apt.appointment_number} className="hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-mono text-xs text-gray-500">{apt.appointment_number}</td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">{apt.customer?.name}</p>
                  <p className="text-xs text-gray-400">{apt.customer?.phone}</p>
                </td>
                <td className="py-3 px-4 text-gray-700">{apt.service?.name}</td>
                <td className="py-3 px-4 text-gray-700">{date}</td>
                <td className="py-3 px-4 text-gray-700">{time}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={apt.status} />
                </td>
                <td className="py-3 px-4 text-right text-gray-700">
                  R$ {apt.price.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  {isPending && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleComplete(apt.appointment_number)}
                        disabled={!!actionLoading}
                        className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-40 transition"
                      >
                        {actionLoading === apt.appointment_number + '-complete' ? '...' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleCancel(apt.appointment_number)}
                        disabled={!!actionLoading}
                        className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-40 transition"
                      >
                        {actionLoading === apt.appointment_number + '-cancel' ? '...' : 'Cancel'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}