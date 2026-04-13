import { create } from 'zustand'
import axios from 'axios'

// Use relative URLs so Vite proxy works
const API_URL = '/api'

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('accessToken', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      })
      
      return true
    } catch (err) {
      set({
        error: err.response?.data?.error || 'Login failed',
        isLoading: false,
      })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    })
  },

  restoreSession: () => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    
    if (token && user) {
      set({
        accessToken: token,
        user: JSON.parse(user),
        isAuthenticated: true,
      })
    }
  },
}))
