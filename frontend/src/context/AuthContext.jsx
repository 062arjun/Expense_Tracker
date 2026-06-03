import { createContext, useContext, useMemo, useState } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('expense_token'))
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('expense_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (data) => {
    localStorage.setItem('expense_token', data.token)
    localStorage.setItem('expense_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const login = async (payload) => {
    const data = await authService.login(payload)
    persist(data)
    return data
  }

  const register = async (payload) => {
    const data = await authService.register(payload)
    persist(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('expense_token')
    localStorage.removeItem('expense_user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, login, register, logout, isAuthenticated: Boolean(token) }), [token, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
