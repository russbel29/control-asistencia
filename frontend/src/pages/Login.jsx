import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── Íconos ───────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)
const IconLock = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
)
const IconEyeOn = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const IconEyeOff = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
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
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — identidad visual ── */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0d1f45 0%, #1a3a6e 55%, #0f2d5a 100%)' }}
      >
        {/* Círculos decorativos — textura sin ser ruido */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-24 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(184,146,42,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 65%)' }} />
        </div>

        {/* Grid de puntos sutil */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Contenido del panel */}
        <div className="relative z-10">
          {/* Línea acento dorada */}
          <div
            className="w-12 h-1 rounded-full mb-8"
            style={{ background: 'linear-gradient(90deg, #b8922a, #e8c96e)' }}
          />
          <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
            Control de<br />
            <span style={{ color: '#d4aa50' }}>Asistencia</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Plataforma de gestión y registro<br />de asistencia del personal.
          </p>
        </div>

        {/* Stats decorativos */}
        <div className="relative z-10 flex gap-8">
          {[
            { valor: '100%', label: 'Cobertura diaria' },
            { valor: '24/7', label: 'Disponibilidad' },
            { valor: 'Seguro', label: 'Acceso por área' },
          ].map(({ valor, label }) => (
            <div key={label}>
              <p className="text-xl font-black text-white">{valor}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Línea de separación inferior */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(184,146,42,0.4), transparent)' }}
        />
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-[360px]">

          {/* Encabezado del form */}
          <div className="mb-10">
            {/* Acento dorado pequeño */}
            <div
              className="w-8 h-0.5 rounded-full mb-5"
              style={{ background: 'linear-gradient(90deg, #b8922a, #e8c96e)' }}
            />
            <h1
              className="text-[28px] font-black tracking-tight leading-none"
              style={{ color: '#0d1f45' }}
            >
              Iniciar sesión
            </h1>
            <p className="mt-2 text-sm" style={{ color: '#8a95a3' }}>
              Ingresá tus credenciales para acceder al sistema.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Usuario */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="usuario"
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#8a95a3' }}
              >
                Usuario
              </label>
              <div
                className="flex items-center gap-3 h-12 px-4 rounded-xl transition-all duration-150"
                style={{
                  background: '#f3f5f8',
                  border: '1.5px solid transparent',
                }}
                onFocusCapture={e => e.currentTarget.style.cssText = 'background:#fff;border:1.5px solid #0d1f45;border-radius:0.75rem;display:flex;align-items:center;gap:0.75rem;height:3rem;padding:0 1rem;transition:all 150ms;'}
                onBlurCapture={e => e.currentTarget.style.cssText = 'background:#f3f5f8;border:1.5px solid transparent;border-radius:0.75rem;display:flex;align-items:center;gap:0.75rem;height:3rem;padding:0 1rem;transition:all 150ms;'}
              >
                <span style={{ color: '#8a95a3' }}><IconUser /></span>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  autoFocus
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                  style={{ color: '#0d1f45' }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: '#8a95a3' }}
              >
                Contraseña
              </label>
              <div
                className="flex items-center gap-3 h-12 px-4 rounded-xl transition-all duration-150"
                style={{
                  background: '#f3f5f8',
                  border: '1.5px solid transparent',
                }}
                onFocusCapture={e => e.currentTarget.style.cssText = 'background:#fff;border:1.5px solid #0d1f45;border-radius:0.75rem;display:flex;align-items:center;gap:0.75rem;height:3rem;padding:0 1rem;transition:all 150ms;'}
                onBlurCapture={e => e.currentTarget.style.cssText = 'background:#f3f5f8;border:1.5px solid transparent;border-radius:0.75rem;display:flex;align-items:center;gap:0.75rem;height:3rem;padding:0 1rem;transition:all 150ms;'}
              >
                <span style={{ color: '#8a95a3' }}><IconLock /></span>
                <input
                  id="password"
                  type={verPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none"
                  style={{ color: '#0d1f45' }}
                />
                <button
                  type="button"
                  onClick={() => setVerPassword(v => !v)}
                  tabIndex={-1}
                  className="transition-colors duration-150"
                  style={{ color: '#8a95a3' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0d1f45'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8a95a3'}
                >
                  {verPassword ? <IconEyeOn /> : <IconEyeOff />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                style={{
                  background: '#fef2f2',
                  border: '1px solid rgba(220,38,38,0.15)',
                  color: '#b91c1c',
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" className="shrink-0">
                  <path fillRule="evenodd" clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full h-12 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              style={{
                background: 'linear-gradient(135deg, #0d1f45 0%, #1a3a6e 100%)',
                border: '1.5px solid #b8922a',
                boxShadow: '0 4px 16px rgba(13,31,69,0.25)',
              }}
              onMouseEnter={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 6px 20px rgba(13,31,69,0.35)' }}
              onMouseLeave={e => { if (!cargando) e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,31,69,0.25)' }}
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>

            {/* Links */}
            <div className="flex items-center justify-center gap-4 pt-1">
              {['Olvidé mi contraseña', 'Soporte técnico'].map((txt, i) => (
                <span key={txt} className="flex items-center gap-4">
                  {i > 0 && <span style={{ color: '#e2e5ea' }}>|</span>}
                  <a
                    href="#"
                    className="text-xs transition-colors duration-150"
                    style={{ color: '#8a95a3' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#0d1f45'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8a95a3'}
                  >
                    {txt}
                  </a>
                </span>
              ))}
            </div>

          </form>
        </div>
      </div>

    </div>
  )
}
