import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useBooking } from '../../contexts/BookingContext'
import { bookingService } from '../../services/bookingService'
import { Card, CardHeader, CardTitle, Button, EmptyState } from '../../components/ui'
import { ThemeToggle } from '../../components/ThemeToggle'
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

  const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i))

  if (!professional || !service) return null

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
            Choose a time
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
            {service.name} with {professional.name} · {service.duration} min
          </p>
        </div>

        {/* Date strip */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            WebkitOverflowScrolling: 'touch' as any,
          }}
        >
          {days.map((day) => {
            const isSelected = toDateString(day) === toDateString(selectedDate)
            return (
              <button
                key={toDateString(day)}
                onClick={() => setSelectedDate(day)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isSelected ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
                  backgroundColor: isSelected ? 'var(--color-action-primary)' : 'var(--color-bg-surface)',
                  color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                  cursor: 'pointer',
                  minWidth: '60px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '11px', fontWeight: 500, opacity: 0.8 }}>
                  {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2, margin: '2px 0' }}>
                  {day.getDate()}
                </span>
                <span style={{ fontSize: '11px', opacity: 0.8 }}>
                  {day.toLocaleDateString('en-GB', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>

        {/* Time slots */}
        <Card padding="none">
          <CardHeader>
            <CardTitle>
              Available times —{' '}
              {selectedDate.toLocaleDateString('en-GB', {
                weekday: 'long', day: '2-digit', month: 'long',
              })}
            </CardTitle>
          </CardHeader>
          <div style={{ padding: '16px' }}>
            {loading ? (
              <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', padding: '16px 0' }}>
                Loading slots...
              </p>
            ) : slots.length === 0 ? (
              <EmptyState
                title="No available times"
                description="Try selecting a different date."
              />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
                gap: '8px',
              }}>
                {slots.map((slot) => {
                  const isSelected = selectedSlot === slot
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isSelected ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
                        backgroundColor: isSelected ? 'var(--color-action-primary)' : 'var(--color-bg-surface)',
                        color: isSelected ? '#FFFFFF' : 'var(--color-text-primary)',
                        fontSize: '13px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </Card>

        {selectedSlot && (
          <Button fullWidth onClick={handleContinue}>
            Continue to confirmation
          </Button>
        )}

      </div>
    </div>
  )
}