export interface Customer {
  id: number
  name: string
  phone: string
}

export interface Professional {
  id: number
  name: string
  bio: string | null
  photo: string | null
}

export interface Service {
  id: number
  name: string
  duration: number
  price: number
}

export interface Appointment {
  appointment_number: string
  status: 'pending' | 'completed' | 'cancelled'
  starts_at: string
  ends_at: string
  price: number
  duration: number
  notes: string | null
  professional?: Professional
  customer?: Customer
  service?: Service
}

export interface ProfessionalProfile {
  id: number
  name: string
  email: string
  bio: string | null
  photo: string | null
  active: boolean
}

export interface DashboardMetrics {
  filter: string
  period_start: string
  period_end: string
  total: number
  completed: number
  pending: number
  cancelled: number
  revenue: number
  today: {
    total: number
    completed: number
    pending: number
    revenue: number
  }
}

export interface AvailabilityResponse {
  date: string
  professional_id: number
  service_id: number
  duration_minutes: number
  slots: string[]
}

export interface IdentifyResponse {
  status: 'created' | 'returning'
  customer: Customer
  has_upcoming_appointments: boolean
}