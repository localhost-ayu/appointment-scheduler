import axios from 'axios'

const BASE_URL = 'http://localhost:8000/api'

// Public API — no authentication
export const bookingApi = axios.create({
  baseURL: `${BASE_URL}/booking`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Professional API — token injected per request
export const professionalApi = axios.create({
  baseURL: `${BASE_URL}/professional`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Inject token from localStorage on every professional request
professionalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('professional_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Redirect to login on 401
professionalApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('professional_token')
      window.location.href = '/professional/login'
    }
    return Promise.reject(error)
  }
)