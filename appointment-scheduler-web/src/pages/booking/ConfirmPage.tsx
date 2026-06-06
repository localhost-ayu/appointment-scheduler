import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import { Card, CardHeader, CardTitle, Button } from '../../components/ui'
import { ThemeToggle } from '../../components/ThemeToggle'
import type { Professional, Service } from '../../types'

export function ConfirmPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { customer } = useBooking()

  const { professional, service, date, time } = (location.state ?? {}) as {
    professional?: Professional
    service?: Service
    date?: string
    time?: string
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!professional || !service || !date || !time || !customer) {
    navigate('/booking/new', { replace: true })
    return null
  }

  const formattedDate = new Date(`${date}T${time}`).toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  const rows = [
    { label: 'Customer', value: customer.name },
    { label: 'Professional', value: professional.name },
    { label: 'Service', value: service.name },
    { label: 'Date', value: formattedDate },
    { label: 'Time', value: time },
    { label: 'Duration', value: `${service.duration} min` },
  ]

  const handleConfirm = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await bookingService.bookAppointment({
        customer_id: customer.id,
        professional_id: professional.id,
        service_id: service.id,
        starts_at: `${date} ${time}`,
      })
      navigate(`/booking/success/${res.data.data.appointment_number}`)
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('This slot was just taken. Please go back and choose another time.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
            Confirm appointment
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Review the details before confirming
          </p>
        </div>

        <Card padding="none">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <div style={{ padding: '0' }}>
            {rows.map(({ label, value }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 24px',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--color-border-default)' : 'none',
                }}
              >
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {label}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                  {value}
                </span>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 24px',
              borderTop: '1px solid var(--color-border-default)',
              backgroundColor: 'var(--color-bg-subtle)',
              borderBottomLeftRadius: 'var(--radius-lg)',
              borderBottomRightRadius: 'var(--radius-lg)',
            }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                Total
              </span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                R$ {service.price.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {error && (
          <div style={{
            fontSize: '13px',
            color: 'var(--color-error-text)',
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
          }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button fullWidth loading={loading} onClick={handleConfirm}>
            Confirm appointment
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>

      </div>
    </div>
  )
}