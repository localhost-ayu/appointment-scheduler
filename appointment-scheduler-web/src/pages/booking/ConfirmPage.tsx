import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
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

  const startsAt = `${date} ${time}`

  const formattedDate = new Date(`${date}T${time}`).toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  })

  const handleConfirm = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await bookingService.bookAppointment({
        customer_id: customer.id,
        professional_id: professional.id,
        service_id: service.id,
        starts_at: startsAt,
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Confirm Appointment</h1>
          <p className="text-sm text-gray-500 mt-1">Review your details before confirming</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">

          {[
            { label: 'Customer', value: customer.name },
            { label: 'Professional', value: professional.name },
            { label: 'Service', value: service.name },
            { label: 'Date', value: formattedDate },
            { label: 'Time', value: time },
            { label: 'Duration', value: `${service.duration} min` },
            { label: 'Price', value: `R$ ${service.price.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-medium text-gray-900">{value}</span>
            </div>
          ))}

        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-xl transition"
          >
            {loading ? 'Booking...' : 'Confirm appointment'}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition"
          >
            Go back
          </button>
        </div>

      </div>
    </div>
  )
}