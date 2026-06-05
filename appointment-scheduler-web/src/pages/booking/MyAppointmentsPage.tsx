import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import { StatusBadge } from '../../components/professional/StatusBadge'
import type { Appointment } from '../../types'

export function MyAppointmentsPage() {
  const { customer } = useBooking()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (!customer) return
    bookingService.getAppointments(customer.phone)
      .then((res) => setAppointments(res.data.data))
      .finally(() => setLoading(false))
  }, [customer])

  const handleCancel = async (appointmentNumber: string) => {
    if (!customer) return
    if (!confirm('Cancel this appointment?')) return
    setCancellingId(appointmentNumber)
    try {
      await bookingService.cancelAppointment(appointmentNumber, customer.phone)
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointment_number === appointmentNumber ? { ...a, status: 'cancelled' } : a
        )
      )
    } catch {
      alert('Failed to cancel appointment.')
    } finally {
      setCancellingId(null)
    }
  }

  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'UTC',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">My Appointments</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, {customer?.name}</p>
          </div>
          <button
            onClick={() => navigate('/booking/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition"
          >
            New appointment
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            No appointments found.
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.appointment_number}
                className="bg-white rounded-2xl border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{apt.service?.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">with {apt.professional?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{formatDateTime(apt.starts_at)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={apt.status} />
                    <p className="text-sm font-medium text-gray-700">R$ {apt.price.toFixed(2)}</p>
                  </div>
                </div>

                {apt.status === 'pending' && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => handleCancel(apt.appointment_number)}
                      disabled={cancellingId === apt.appointment_number}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition disabled:opacity-40"
                    >
                      {cancellingId === apt.appointment_number ? 'Cancelling...' : 'Cancel'}
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400 font-mono mt-3">{apt.appointment_number}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}