import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import type { Professional, Service } from '../../types'

function toDateString(date: Date) {
  return date.toISOString().split('T')[0]
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function AvailabilityPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { customer } = useBooking()

  const { professional, service } = (location.state ?? {}) as {
    professional?: Professional
    service?: Service
  }

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirect if state is missing
  useEffect(() => {
    if (!professional || !service) {
      navigate('/booking/new', { replace: true })
    }
  }, [professional, service, navigate])

  useEffect(() => {
    if (!professional || !service) return
    setSelectedSlot(null)
    setLoading(true)
    bookingService
      .getAvailability(professional.id, toDateString(selectedDate), service.id)
      .then((res) => setSlots(res.data.slots))
      .finally(() => setLoading(false))
  }, [selectedDate, professional, service])

  const handleContinue = () => {
    if (!selectedSlot || !professional || !service || !customer) return
    navigate('/booking/confirm', {
      state: {
        professional,
        service,
        date: toDateString(selectedDate),
        time: selectedSlot,
      },
    })
  }

  // Generate next 14 days
  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  const dayLabel = (date: Date) =>
    date.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })

  if (!professional || !service) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">Choose a time</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {service.name} with {professional.name} · {service.duration} min
          </p>
        </div>

        {/* Date selector */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const isSelected = toDateString(day) === toDateString(selectedDate)
            return (
              <button
                key={toDateString(day)}
                onClick={() => setSelectedDate(day)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border text-sm transition ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200'
                }`}
              >
                <span className="text-xs font-medium">
                  {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
                <span className="text-lg font-bold leading-none mt-1">
                  {day.getDate()}
                </span>
                <span className="text-xs mt-1">
                  {day.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>

        {/* Time slots */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Available times for {dayLabel(selectedDate)}
          </p>

          {loading ? (
            <p className="text-sm text-gray-400">Loading slots...</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-gray-400">No available times for this date.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                    selectedSlot === slot
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-100 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedSlot && (
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          >
            Continue to confirmation
          </button>
        )}

      </div>
    </div>
  )
}