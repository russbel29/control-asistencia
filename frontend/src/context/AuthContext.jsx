import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [fiscal, setFiscal] = useState(null)
  // verificando = true mientras validamos el token contra el backend al iniciar
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    async function verificarSesion() {
      const token  = localStorage.getItem('token')
      const saved  = localStorage.getItem('fiscal')

      // Sin token → no hay sesión, ir a login
      if (!token || !saved) {
        setVerificando(false)
        return
      }

      try {
        // Validamos el token haciendo una llamada real al backend
        // Si el token expiró o es inválido, el interceptor de api.js lanzará 401
        // y limpiará el localStorage automáticamente
        await api.get('/asistencia/dia')
        setFiscal(JSON.parse(saved))
      } catch {
        // Token inválido o expirado — limpiar sesión
        localStorage.removeItem('token')
        localStorage.removeItem('fiscal')
        setFiscal(null)
      } finally {
        setVerificando(false)
      }
    }

    verificarSesion()
  }, [])

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

  // Mientras se verifica el token no renderizamos nada — evita el flash del dashboard
  if (verificando) {
    return (
      <div style={{
        minHeight: '100dvh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#F0F2F8', fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <svg style={{ width: '32px', height: '32px', color: '#1A56DB', animation: 'spin 1s linear infinite' }}
             fill="none" viewBox="0 0 24 24">
          <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path style={{ opacity: 0.8 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
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
