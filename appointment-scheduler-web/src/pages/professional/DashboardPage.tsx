import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { professionalApi } from '../../services/api'

export function DashboardPage() {
  const { professional, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await professionalApi.post('/logout')
    } catch {
      // Token may already be invalid — proceed with local logout regardless
    } finally {
      logout()
      navigate('/professional/login')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{professional?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="p-6">
        <p className="text-gray-500 text-sm">Dashboard content coming in Block 11.</p>
      </main>
    </div>
  )
}