import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { professionalApi } from '../../services/api'
import { Card, CardHeader, CardTitle, Button, Input } from '../../components/ui'
import { ThemeToggle } from '../../components/ThemeToggle'
import type { ProfessionalProfile } from '../../types'

export function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/professional/dashboard')
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const response = await professionalApi.post<{
        token: string
        professional: ProfessionalProfile
      }>('/login', { email, password })
      login(response.data.token, response.data.professional)
      navigate('/professional/dashboard')
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 50 }}>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Card padding="none">
          <CardHeader>
            <div>
              <CardTitle>Professional Access</CardTitle>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '2px 0 0' }}>
                Sign in to manage your appointments
              </p>
            </div>
          </CardHeader>

          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              {error && (
                <div style={{
                  fontSize: '13px',
                  color: 'var(--color-error-text)',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                }}>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth loading={loading}>
                Sign in
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}