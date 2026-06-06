import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import { Card, CardHeader, CardTitle, Button } from '../../components/ui'
import { ThemeToggle } from '../../components/ThemeToggle'
import type { Appointment } from '../../types'

function generateICS(appointment: Appointment): string {
  const fmt = (iso: string) =>
    iso.replace('T', '').replace(/[-:]/g, '').substring(0, 15)
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(appointment.starts_at)}`,
    `DTEND:${fmt(appointment.ends_at)}`,
    `SUMMARY:${appointment.service?.name} with ${appointment.professional?.name}`,
    `DESCRIPTION:Appointment ${appointment.appointment_number}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function SuccessPage() {
  const { appointmentNumber } = useParams<{ appointmentNumber: string }>()
  const navigate = useNavigate()

  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appointmentNumber) return
    bookingService.getAppointment(appointmentNumber)
      .then((res) => setAppointment(res.data.data))
      .finally(() => setLoading(false))
  }, [appointmentNumber])

  const handleDownloadICS = () => {
    if (!appointment) return
    const blob = new Blob([generateICS(appointment)], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${appointment.appointment_number}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleGoogleCalendar = () => {

    if (!appointment) return

    const start = new Date(appointment.starts_at)

    const end = new Date(appointment.ends_at)

    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

    const title = encodeURIComponent(`${appointment.service?.name} with ${appointment.professional?.name}`)

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}`

    window.open(url, '_blank')

  }

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      weekday: 'long', day: '2-digit', month: 'long',
      year: 'numeric', hour: '2-digit', minute: '2-digit',
      timeZone: 'UTC',
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Loading...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Appointment not found.</p>
      </div>
    )
  }

  const rows = [
    { label: 'Professional', value: appointment.professional?.name },
    { label: 'Service', value: appointment.service?.name },
    { label: 'Date & Time', value: formatDateTime(appointment.starts_at) },
    { label: 'Duration', value: `${appointment.duration} min` },
    { label: 'Price', value: `R$ ${appointment.price.toFixed(2)}` },
  ]

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        {/* Success indicator */}
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-success-text)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 6px' }}>
            Appointment confirmed
          </h1>
          <div style={{
            display: 'inline-block',
            padding: '3px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-default)',
          }}>
            <span style={{
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
            }}>
              {appointment.appointment_number}
            </span>
          </div>
        </div>

        {/* Details */}
        <Card padding="none">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <div>
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
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button fullWidth variant="secondary" onClick={handleGoogleCalendar}>
            Add to Google Calendar
          </Button>
          <Button fullWidth variant="secondary" onClick={handleDownloadICS}>
            Download .ICS file
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/booking')}>
            Back to start
          </Button>
        </div>

      </div>
    </div>
  )
}