import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Intent: institucional, serio, confiable.
 * Palette: --ink-900 (azul marino) + --gold-500 (dorado sello) + --surface-2 (papel inset)
 * Depth: inset inputs (fondo oscuro en reposo, blanco en foco). Sin sombras dramáticas.
 * Signature: divisor vertical dorado entre escudo y nombre — sello partido en dos.
 * Spacing: base 4px.
 */

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function InputGroup({ label, id, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--text-tertiary)' }}
      >
        {label}
      </label>
      {/* Wrapper con clase inset — focus ring en el wrapper, no en el input */}
      <div className="relative rounded-lg overflow-hidden input-inset">
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

// ─── Íconos — mismo set (Heroicons outline), mismo peso (1.75), mismo tamaño (18px) ──

const I = {
  User: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  ),
  EyeOn: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  Alert: () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" />
    </svg>
  ),
}

// Clase base del input — sin fondo (lo da el wrapper), sin outline (lo da el wrapper)
const INPUT = 'w-full h-12 pl-11 pr-4 bg-transparent text-sm font-medium focus:outline-none'

// ─── Página ───────────────────────────────────────────────────────────────────

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
      className="min-h-screen flex items-center justify-center bg-paper px-4 py-12"
    >
      {/* Card — papel blanco sobre escritorio gris frío */}
      <div
        className="w-full max-w-[400px] rounded-2xl overflow-hidden"
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 2px 8px rgba(26,47,90,0.06), 0 12px 40px rgba(26,47,90,0.10)',
        }}
      >

        {/* ── Cabecera institucional ── */}
        <div
          className="px-8 pt-8 pb-7"
          style={{ borderBottom: '1px solid var(--border-soft)' }}
        >
          {/* Signature — escudo | divisor dorado | nombre institucional */}
          <div className="flex items-center gap-0 mb-5">

            {/* Escudo */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'var(--ink-900)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path
                  d="M12 2.5 L14.8 9 L21.5 9.8 L16.5 14.5 L17.8 21 L12 17.8 L6.2 21 L7.5 14.5 L2.5 9.8 L9.2 9 Z"
                  fill="var(--gold-500)"
                />
              </svg>
            </div>

            {/* Divisor dorado — la firma */}
            <div
              className="mx-3.5 w-px"
              style={{
                background: 'var(--gold-500)',
                height: '36px',
                opacity: 0.75,
              }}
            />

            {/* Texto institucional */}
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Municipalidad
              </p>
              <p
                className="text-[17px] font-black tracking-tight leading-tight mt-1"
                style={{ color: 'var(--ink-900)' }}
              >
                Control de Asistencia
              </p>
            </div>
          </div>

          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Ingresá tus credenciales para continuar.
          </p>
        </div>

        {/* ── Formulario ── */}
        <form onSubmit={handleSubmit} className="px-8 py-7 flex flex-col gap-5">

          <InputGroup label="Usuario" id="usuario" icon={<I.User />}>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Ingrese su usuario"
              required
              autoFocus
              className={INPUT}
              style={{ color: 'var(--text-primary)' }}
            />
          </InputGroup>

          <InputGroup label="Contraseña" id="password" icon={<I.Lock />}>
            <input
              id="password"
              type={verPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
              className={INPUT + ' pr-12'}
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={() => setVerPassword(v => !v)}
              tabIndex={-1}
              className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-150"
              style={{ color: 'var(--text-tertiary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
            >
              {verPassword ? <I.EyeOn /> : <I.EyeOff />}
            </button>
          </InputGroup>

          {/* Recordarme */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={e => setRecordarme(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{ accentColor: 'var(--ink-900)' }}
            />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Recordarme
            </span>
          </label>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm"
              style={{
                background: 'var(--error-bg)',
                border: '1px solid var(--error-border)',
                color: 'var(--error-text)',
              }}
            >
              <span className="mt-0.5 shrink-0"><I.Alert /></span>
              {error}
            </div>
          )}

          {/* Botón principal */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full h-12 rounded-lg text-sm font-bold tracking-wide text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'var(--ink-900)',
              border: '1.5px solid var(--gold-500)',
            }}
            onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = 'var(--ink-700)' }}
            onMouseLeave={e => { if (!cargando) e.currentTarget.style.background = 'var(--ink-900)' }}
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

        </form>

        {/* ── Footer ── */}
        <div
          className="px-8 py-4 flex items-center justify-center gap-4"
          style={{
            borderTop: '1px solid var(--border-soft)',
            background: 'var(--surface-0)',
          }}
        >
          {['Olvidé mi contraseña', 'Soporte técnico'].map((texto, i) => (
            <>
              {i > 0 && (
                <span key={`sep-${i}`} style={{ color: 'var(--border-medium)' }}>|</span>
              )}
              <a
                key={texto}
                href="#"
                className="text-xs transition-colors duration-150"
                style={{ color: 'var(--text-tertiary)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--ink-900)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
              >
                {texto}
              </a>
            </>
          ))}
        </div>

      </div>
    </div>
  )
}
