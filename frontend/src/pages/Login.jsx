import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/* ─── Íconos SVG filled (solid) — más legibles en inputs con fondo gris ─── */
const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
  </svg>
)

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
    <path fillRule="evenodd" clipRule="evenodd"
      d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" />
  </svg>
)

const IconEyeOn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path fillRule="evenodd" clipRule="evenodd"
      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
  </svg>
)

const IconEyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#9E9E9E">
    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.063 15.713l-4.244-4.244a3.75 3.75 0 004.243 4.243zM1.38 11.558A11.272 11.272 0 014.01 8.25L7.11 11.35A5.25 5.25 0 0013.76 18l2.998 2.998a11.25 11.25 0 01-4.757 1.002c-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113z" />
  </svg>
)

export default function Login() {
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const [usuario,     setUsuario]     = useState('')
  const [password,    setPassword]    = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [recordarme,  setRecordarme]  = useState(false)
  const [error,       setError]       = useState('')
  const [cargando,    setCargando]    = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      await login(usuario, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales incorrectas')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: '#29B6F6',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        borderRadius: '24px',
        padding: '0 36px 36px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
        position: 'relative',
      }}>

        {/* Avatar — sobresale por encima de la card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-44px', marginBottom: '32px' }}>
          <div style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            background: '#ECEFF1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '4px solid #FFFFFF',
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="#546E7A">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Input usuario — pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#F5F5F5', borderRadius: '50px',
            padding: '0 20px', height: '52px',
            border: '2px solid transparent',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#29B6F6' }}
          onBlur={e  => { e.currentTarget.style.borderColor = 'transparent' }}
          >
            <IconUser />
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Nombre de usuario"
              required
              autoFocus
              autoComplete="username"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', color: '#212121',
              }}
            />
          </div>

          {/* Input contraseña — pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: '#F5F5F5', borderRadius: '50px',
            padding: '0 16px 0 20px', height: '52px',
            border: '2px solid transparent',
            transition: 'border-color 0.15s ease',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#29B6F6' }}
          onBlur={e  => { e.currentTarget.style.borderColor = 'transparent' }}
          >
            <IconLock />
            <input
              type={verPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              autoComplete="current-password"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '14px', color: '#212121',
              }}
            />
            <button
              type="button"
              onClick={() => setVerPassword(v => !v)}
              tabIndex={-1}
              aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '4px', display: 'flex', alignItems: 'center',
              }}
            >
              {verPassword ? <IconEyeOn /> : <IconEyeOff />}
            </button>
          </div>

          {/* Recordarme + olvidé */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={recordarme}
                onChange={e => setRecordarme(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#29B6F6', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: '#757575' }}>Recuérdame</span>
            </label>
            <a href="#" style={{ fontSize: '13px', color: '#757575', textDecoration: 'none' }}>
              He olvidado la contraseña
            </a>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#FEF2F2', color: '#DC2626',
              border: '1px solid rgba(220,38,38,0.15)',
              borderRadius: '12px', padding: '10px 14px',
              fontSize: '13px', fontWeight: 500,
            }}>
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
              </svg>
              {error}
            </div>
          )}

          {/* Botón Iniciar sesión — pill con gradiente cyan */}
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%', height: '52px', borderRadius: '50px',
              border: 'none', cursor: cargando ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(90deg, #26C6DA 0%, #00ACC1 100%)',
              color: '#FFFFFF', fontSize: '15px', fontWeight: 700,
              letterSpacing: '0.02em',
              boxShadow: '0 6px 20px rgba(0,172,193,0.40)',
              opacity: cargando ? 0.7 : 1,
              transition: 'all 0.15s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '4px',
            }}
            onMouseEnter={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,172,193,0.55)' }}
            onMouseLeave={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,172,193,0.40)' }}
          >
            {cargando ? (
              <>
                <svg style={{ width: '18px', height: '18px', animation: 'login-spin 1s linear infinite' }}
                     fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.3 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.9 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Iniciando sesión...
              </>
            ) : 'Iniciar sesión'}
          </button>

          {/* Link soporte */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9E9E9E', marginTop: '4px' }}>
            <a href="#" style={{ color: '#29B6F6', textDecoration: 'none', fontWeight: 500 }}>
              Soporte técnico
            </a>
          </p>

        </form>
      </div>

      <style>{`@keyframes login-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
