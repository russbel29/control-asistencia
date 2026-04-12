import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const IconUser = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)
const IconLock = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)
const IconEyeOn = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IconEyeOff = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
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
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(160deg, #2980d4 0%, #0b4a8a 100%)' }}
    >
      {/* Card */}
      <div
        className="w-full rounded-3xl px-10 py-10"
        style={{
          maxWidth: 400,
          background: '#ffffff',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* Avatar — sits ON TOP of card, half outside via negative margin */}
        <div className="flex justify-center" style={{ marginTop: -40 }}>
          <div
            className="flex items-center justify-center rounded-full"
            style={{
              width: 80,
              height: 80,
              background: '#f0f4f9',
              border: '4px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
          >
            <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="#94a8bf" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h1
          className="text-center text-[26px] font-extrabold mt-5 mb-8"
          style={{ color: '#1a2e4a' }}
        >
          Iniciar sesión
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Usuario — underline input */}
          <div
            className="flex items-center gap-3 pb-3 transition-colors duration-150"
            style={{ borderBottom: '2px solid #e0e4ea' }}
            onFocus={e => e.currentTarget.style.borderBottom = '2px solid #2980d4'}
            onBlur={e => e.currentTarget.style.borderBottom = '2px solid #e0e4ea'}
          >
            <span style={{ color: '#a0b0c4' }}><IconUser /></span>
            <input
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Usuario"
              required
              autoFocus
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#b0bece]"
              style={{ color: '#1a2e4a' }}
            />
          </div>

          {/* Contraseña — underline input */}
          <div
            className="flex items-center gap-3 pb-3 transition-colors duration-150"
            style={{ borderBottom: '2px solid #e0e4ea' }}
            onFocus={e => e.currentTarget.style.borderBottom = '2px solid #2980d4'}
            onBlur={e => e.currentTarget.style.borderBottom = '2px solid #e0e4ea'}
          >
            <span style={{ color: '#a0b0c4' }}><IconLock /></span>
            <input
              type={verPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#b0bece]"
              style={{ color: '#1a2e4a' }}
            />
            <button
              type="button"
              onClick={() => setVerPassword(v => !v)}
              tabIndex={-1}
              className="transition-colors duration-150"
              style={{ color: '#a0b0c4' }}
              onMouseEnter={e => e.currentTarget.style.color = '#2980d4'}
              onMouseLeave={e => e.currentTarget.style.color = '#a0b0c4'}
            >
              {verPassword ? <IconEyeOn /> : <IconEyeOff />}
            </button>
          </div>

          {/* Recordarme + olvidé */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={e => setRecordarme(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: '#2980d4' }}
              />
              <span className="text-xs" style={{ color: '#8a99ab' }}>Recordarme</span>
            </label>
            <a
              href="#"
              className="text-xs font-medium transition-colors duration-150"
              style={{ color: '#2980d4' }}
            >
              Olvidé mi contraseña
            </a>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-medium"
              style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(220,38,38,0.15)' }}
            >
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" className="shrink-0">
                <path fillRule="evenodd" clipRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
              </svg>
              {error}
            </div>
          )}

          {/* Botón — stays INSIDE card padding */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full h-12 rounded-full text-[15px] font-bold text-white transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{
              background: 'linear-gradient(135deg, #2980d4 0%, #1565b8 100%)',
              boxShadow: '0 6px 20px rgba(41,128,212,0.45)',
            }}
            onMouseEnter={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 8px 28px rgba(41,128,212,0.6)' }}
            onMouseLeave={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 6px 20px rgba(41,128,212,0.45)' }}
          >
            {cargando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Iniciando sesión...
              </span>
            ) : 'Iniciar sesión'}
          </button>

          {/* Soporte */}
          <p className="text-center text-xs mt-1" style={{ color: '#8a99ab' }}>
            ¿Problemas para ingresar?{' '}
            <a
              href="#"
              className="font-semibold transition-colors duration-150"
              style={{ color: '#2980d4' }}
            >
              Soporte técnico
            </a>
          </p>

        </form>
      </div>
    </div>
  )
}
