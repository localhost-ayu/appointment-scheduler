import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { professionalApi } from '../../services/api'
import { ThemeToggle } from '../ThemeToggle'
import { Button } from '../ui'

export function DashboardHeader() {
  const { professional, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await professionalApi.post('/logout')
    } catch {
      // proceed regardless
    } finally {
      logout()
      navigate('/professional/login')
    }
  }

  return (
    <header style={{
      backgroundColor: 'var(--color-bg-surface)',
      borderBottom: '1px solid var(--color-border-default)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      <div
        className="flex items-center justify-between"
        style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 32px', height: '56px' }}
      >
        <div className="flex items-center gap-3">
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-action-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Scheduler
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {professional?.name}
          </span>
          <ThemeToggle />
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}