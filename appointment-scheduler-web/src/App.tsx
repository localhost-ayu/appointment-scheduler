import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { BookingProvider } from './contexts/BookingContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ThemeProvider } from './contexts/ThemeContext'

// Booking pages (stubs for now)
import { IdentifyPage } from './pages/booking/IdentifyPage'
import { MyAppointmentsPage } from './pages/booking/MyAppointmentsPage'
import { NewAppointmentPage } from './pages/booking/NewAppointmentPage'
import { AvailabilityPage } from './pages/booking/AvailabilityPage'
import { ConfirmPage } from './pages/booking/ConfirmPage'
import { SuccessPage } from './pages/booking/SuccessPage'
import { BookingGuard } from './components/BookingGuard'

// Professional pages (stubs for now)
import { LoginPage } from './pages/professional/LoginPage'
import { DashboardPage } from './pages/professional/DashboardPage'

export default function App() {
  return (
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/booking" replace />} />

            {/* Booking flow */}
            <Route path="/booking" element={<IdentifyPage />} />
            <Route path="/booking/appointments" element={<BookingGuard><MyAppointmentsPage /></BookingGuard>} />
            <Route path="/booking/new" element={<BookingGuard><NewAppointmentPage /></BookingGuard>} />
            <Route path="/booking/availability" element={<BookingGuard><AvailabilityPage /></BookingGuard>} />
            <Route path="/booking/confirm" element={<BookingGuard><ConfirmPage /></BookingGuard>} />
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
  </ThemeProvider>
  )
}