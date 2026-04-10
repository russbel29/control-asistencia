import { createContext, useContext, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [fiscal, setFiscal] = useState(() => {
    try {
      const saved = localStorage.getItem('fiscal')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  async function login(usuario, password) {
    const { data } = await api.post('/auth/login', { usuario, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('fiscal', JSON.stringify(data.fiscal))
    setFiscal(data.fiscal)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('fiscal')
    setFiscal(null)
  }

  return (
    <AuthContext.Provider value={{ fiscal, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
