import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import { Card, Button, EmptyState } from '../../components/ui'
import { StatusBadge } from '../../components/professional/StatusBadge'
import { ThemeToggle } from '../../components/ThemeToggle'
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
          a.appointment_number === appointmentNumber
            ? { ...a, status: 'cancelled' }
            : a
        )
      )
    } catch {
      alert('Failed to cancel appointment.')
    } finally {
      setCancellingId(null)
    }
  }

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'short', day: '2-digit', month: 'short',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'UTC',
    })

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
              My Appointments
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Welcome back, {customer?.name}
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/booking/new')}>
            New appointment
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <Card>
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '14px' }}>
              Loading...
            </div>
          </Card>
        ) : appointments.length === 0 ? (
          <Card>
            <EmptyState
              title="No appointments yet"
              description="Book your first appointment to get started."
              action={{ label: 'Book now', onClick: () => navigate('/booking/new') }}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => (
              <Card key={apt.appointment_number} padding="none">
                <div style={{ padding: '16px 20px' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                        {apt.service?.name}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                        with {apt.professional?.name}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
                        {formatDateTime(apt.starts_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <StatusBadge status={apt.status} />
                      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                        R$ {apt.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {apt.status === 'pending' && (
                    <div
                      className="flex items-center gap-3 mt-3 pt-3"
                      style={{ borderTop: '1px solid var(--color-border-default)' }}
                    >
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(apt.appointment_number)}
                        loading={cancellingId === apt.appointment_number}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  <p style={{
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                    margin: '10px 0 0',
                  }}>
                    {apt.appointment_number}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}