import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookingService } from '../../services/bookingService'
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
      state: {
        professional: selectedProfessional,
        service: selectedService,
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-8">

        <div>
          <h1 className="text-xl font-semibold text-gray-900">New Appointment</h1>
          <p className="text-sm text-gray-500 mt-0.5">Select a professional and service</p>
        </div>

        {/* Professionals */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-3">Professional</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {professionals.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectProfessional(p)}
                className={`text-left p-4 rounded-2xl border transition ${
                  selectedProfessional?.id === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm flex-shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                    {p.bio && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{p.bio}</p>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Services */}
        {selectedProfessional && (
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-3">Service</h2>
            {servicesLoading ? (
              <p className="text-sm text-gray-400">Loading services...</p>
            ) : (
              <div className="space-y-2">
                {services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    className={`w-full text-left p-4 rounded-2xl border transition ${
                      selectedService?.id === s.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.duration} min</p>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">R$ {s.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Continue */}
        {selectedProfessional && selectedService && (
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition"
          >
            Choose date and time
          </button>
        )}

      </div>
    </div>
  )
}