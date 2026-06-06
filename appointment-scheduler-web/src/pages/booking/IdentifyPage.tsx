import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import { ThemeToggle } from '../../components/ThemeToggle'
import { Card, CardHeader, CardTitle, Button, Input } from '../../components/ui'

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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px' }}>
        <ThemeToggle />
      </div>

         <div className="w-full max-w-sm">
      <Card padding="none">
        <CardHeader>
          <div>
            <CardTitle>Book an Appointment</CardTitle>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
              Enter your details to get started
            </p>
          </div>
        </CardHeader>
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Your name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Carlos Mendes"
              required
              autoFocus
            />
            <Input
              label="Phone number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="51999990000"
              required
            />
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
            <Button type="submit" fullWidth loading={loading}>
              Continue
            </Button>
          </form>
        </div>
      </Card>
    </div>
  </div>
  
  )
}