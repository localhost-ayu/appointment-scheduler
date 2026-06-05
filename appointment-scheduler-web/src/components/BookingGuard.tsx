import { Navigate } from 'react-router-dom'
import { useBooking } from '../contexts/BookingContext'
import type { ReactNode } from 'react'

export function BookingGuard({ children }: { children: ReactNode }) {
  const { customer } = useBooking()

  if (!customer) {
    return <Navigate to="/booking" replace />
  }

  return <>{children}</>
}