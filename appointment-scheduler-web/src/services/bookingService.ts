import { bookingApi } from './api'
import type {
  IdentifyResponse,
  Appointment,
  Professional,
  Service,
  AvailabilityResponse,
} from '../types'

export const bookingService = {
  identify(name: string, phone: string) {
    return bookingApi.post<IdentifyResponse>('/identify', { name, phone })
  },

  getProfessionals() {
    return bookingApi.get<{ data: Professional[] }>('/professionals')
  },

  getServices(professionalId: number) {
    return bookingApi.get<{ data: Service[] }>(`/professionals/${professionalId}/services`)
  },

  getAvailability(professionalId: number, date: string, serviceId: number) {
    return bookingApi.get<AvailabilityResponse>(
      `/professionals/${professionalId}/availability`,
      { params: { date, service_id: serviceId } }
    )
  },

  bookAppointment(payload: {
    customer_id: number
    professional_id: number
    service_id: number
    starts_at: string
  }) {
    return bookingApi.post<{ data: Appointment }>('/appointments', payload)
  },

  getAppointments(phone: string) {
    return bookingApi.get<{ data: Appointment[] }>('/appointments', { params: { phone } })
  },

  getAppointment(appointmentNumber: string) {
    return bookingApi.get<{ data: Appointment }>(`/appointments/${appointmentNumber}`)
  },

  cancelAppointment(appointmentNumber: string, phone: string) {
    return bookingApi.post(`/appointments/${appointmentNumber}/cancel`, { phone })
  },

  rescheduleAppointment(appointmentNumber: string, phone: string, starts_at: string) {
    return bookingApi.post(`/appointments/${appointmentNumber}/reschedule`, { phone, starts_at })
  },
}