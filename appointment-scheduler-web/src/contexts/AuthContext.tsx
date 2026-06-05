import { createContext, useContext, useState, ReactNode } from 'react'
import type { ProfessionalProfile } from '../types'

interface AuthContextValue {
  professional: ProfessionalProfile | null
  token: string | null
  login: (token: string, professional: ProfessionalProfile) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('professional_token')
  )
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(
    () => {
      const stored = localStorage.getItem('professional_data')
      return stored ? JSON.parse(stored) : null
    }
  )

  const login = (newToken: string, professionalData: ProfessionalProfile) => {
    localStorage.setItem('professional_token', newToken)
    localStorage.setItem('professional_data', JSON.stringify(professionalData))
    setToken(newToken)
    setProfessional(professionalData)
  }

  const logout = () => {
    localStorage.removeItem('professional_token')
    localStorage.removeItem('professional_data')
    setToken(null)
    setProfessional(null)
  }

  return (
    <AuthContext.Provider value={{
      professional,
      token,
      login,
      logout,
      isAuthenticated: !!token,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}