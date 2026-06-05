import { createContext, useContext, useState, ReactNode } from 'react'
import type { Customer } from '../types'

interface BookingContextValue {
  customer: Customer | null
  setCustomer: (customer: Customer) => void
  clearCustomer: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomerState] = useState<Customer | null>(null)

  const setCustomer = (customer: Customer) => {
    setCustomerState(customer)
  }

  const clearCustomer = () => {
    setCustomerState(null)
  }

  return (
    <BookingContext.Provider value={{ customer, setCustomer, clearCustomer }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider')
  }
  return context
}