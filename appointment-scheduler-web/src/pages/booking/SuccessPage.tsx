import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import type { Appointment } from '../../types'

function generateICS(appointment: Appointment): string {
  const start = new Date(appointment.starts_at)
  const end = new Date(appointment.ends_at)

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
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
    const ics = generateICS(appointment)
    const blob = new Blob([ics], { type: 'text/calendar' })
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Appointment not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Appointment confirmed</h1>
          <p className="font-mono text-blue-600 font-medium mt-1">{appointment.appointment_number}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 mb-6">
          {[
            { label: 'Professional', value: appointment.professional?.name },
            { label: 'Service', value: appointment.service?.name },
            { label: 'Date & Time', value: formatDateTime(appointment.starts_at) },
            { label: 'Duration', value: `${appointment.duration} min` },
            { label: 'Price', value: `R$ ${appointment.price.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGoogleCalendar}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition"
          >
            Add to Google Calendar
          </button>
          <button
            onClick={handleDownloadICS}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl text-sm transition"
          >
            Download .ICS file
          </button>
          <button
            onClick={() => navigate('/booking')}
            className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition"
          >
            Back to start
          </button>
        </div>

      </div>
    </div>
  )
}