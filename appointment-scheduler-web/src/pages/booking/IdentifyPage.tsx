import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'

export function IdentifyPage() {
  const { setCustomer } = useBooking()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await bookingService.identify(name, phone)
      const { customer, status, has_upcoming_appointments } = res.data

      setCustomer(customer)

      if (status === 'returning' && has_upcoming_appointments) {
        navigate('/booking/appointments')
      } else {
        navigate('/booking/new')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-500 mt-1 text-sm">Enter your details to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Carlos Mendes"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="51999990000"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-xl transition"
            >
              {loading ? 'Checking...' : 'Continue'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}