import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
import { Card, CardHeader, CardTitle, Button } from '../../components/ui'
import { ThemeToggle } from '../../components/ThemeToggle'
import type { Professional, Service } from '../../types'

export function NewAppointmentPage() {
  const navigate = useNavigate()

  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [servicesLoading, setServicesLoading] = useState(false)

  useEffect(() => {
    bookingService.getProfessionals()
      .then((res) => setProfessionals(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  const handleSelectProfessional = async (professional: Professional) => {
    setSelectedProfessional(professional)
    setSelectedService(null)
    setServicesLoading(true)
    try {
      const res = await bookingService.getServices(professional.id)
      setServices(res.data.data)
    } finally {
      setServicesLoading(false)
    }
  }

  const handleContinue = () => {
    if (!selectedProfessional || !selectedService) return
    navigate('/booking/availability', {
      state: { professional: selectedProfessional, service: selectedService },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text-tertiary)' }}>Loading...</p>
      </div>
    )
  }

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
            New Appointment
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
            Select a professional and service to continue
          </p>
        </div>

        {/* Professionals */}
        <Card padding="none">
          <CardHeader>
            <CardTitle>Professional</CardTitle>
          </CardHeader>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {professionals.map((p) => {
              const isSelected = selectedProfessional?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectProfessional(p)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${isSelected ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
                    backgroundColor: isSelected ? 'var(--color-action-primary-subtle)' : 'var(--color-bg-surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--color-bg-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    flexShrink: 0,
                  }}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                      {p.name}
                    </p>
                    {p.bio && (
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                        {p.bio}
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Services */}
        {selectedProfessional && (
          <Card padding="none">
            <CardHeader>
              <CardTitle>Service</CardTitle>
            </CardHeader>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {servicesLoading ? (
                <p style={{ fontSize: '13px', color: 'var(--color-text-tertiary)', padding: '8px 0' }}>
                  Loading services...
                </p>
              ) : (
                services.map((s) => {
                  const isSelected = selectedService?.id === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${isSelected ? 'var(--color-action-primary)' : 'var(--color-border-default)'}`,
                        backgroundColor: isSelected ? 'var(--color-action-primary-subtle)' : 'var(--color-bg-surface)',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease',
                      }}
                    >
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: '0 0 2px' }}>
                          {s.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                          {s.duration} min
                        </p>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, flexShrink: 0 }}>
                        R$ {s.price.toFixed(2)}
                      </p>
                    </button>
                  )
                })
              )}
            </div>
          </Card>
        )}

        {/* Continue */}
        {selectedProfessional && selectedService && (
          <Button fullWidth onClick={handleContinue}>
            Choose date and time
          </Button>
        )}

      </div>
    </div>
  )
}