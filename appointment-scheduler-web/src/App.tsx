import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BookingProvider } from './contexts/BookingContext'
import { ProtectedRoute } from './components/ProtectedRoute'

// Booking pages (stubs for now)
import { IdentifyPage } from './pages/booking/IdentifyPage'
import { MyAppointmentsPage } from './pages/booking/MyAppointmentsPage'
import { NewAppointmentPage } from './pages/booking/NewAppointmentPage'
import { AvailabilityPage } from './pages/booking/AvailabilityPage'
import { ConfirmPage } from './pages/booking/ConfirmPage'
import { SuccessPage } from './pages/booking/SuccessPage'

// Professional pages (stubs for now)
import { LoginPage } from './pages/professional/LoginPage'
import { DashboardPage } from './pages/professional/DashboardPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/booking" replace />} />

            {/* Booking flow */}
            <Route path="/booking" element={<IdentifyPage />} />
            <Route path="/booking/appointments" element={<MyAppointmentsPage />} />
            <Route path="/booking/new" element={<NewAppointmentPage />} />
            <Route path="/booking/availability" element={<AvailabilityPage />} />
            <Route path="/booking/confirm" element={<ConfirmPage />} />
            <Route path="/booking/success/:appointmentNumber" element={<SuccessPage />} />

            {/* Professional area */}
            <Route path="/professional/login" element={<LoginPage />} />
            <Route
              path="/professional/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}