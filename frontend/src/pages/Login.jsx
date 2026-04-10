import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── Tokens de diseño ────────────────────────────────────────────────────────
// Primario:  #1e3a6e  (azul marino institucional)
// Acento:    #c9a84c  (dorado institucional)
// Neutros:   gray-50 / gray-200 / gray-400 / gray-700 / gray-900
// Radio:     12px (rounded-xl) — consistente en toda la app
// Sombra:    shadow-sm en reposo, shadow-md en foco

// ─── Sub-componentes ─────────────────────────────────────────────────────────

function InputField({ label, id, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative flex items-center">
        {/* Ícono izquierdo — mismo color, mismo tamaño en todos los inputs */}
        <span className="absolute left-3.5 text-gray-400 pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

const INPUT_BASE =
  'w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 bg-white text-sm text-gray-900 ' +
  'placeholder:text-gray-400 ' +
  'focus:outline-none focus:border-[#1e3a6e] focus:ring-2 focus:ring-[#1e3a6e]/20 ' +
  'transition-all duration-150'

// ─── Íconos (inline, 20×20, strokeWidth 1.5) ─────────────────────────────────

function IconUser() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function IconEyeOpen() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconEyeClosed() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [usuario, setUsuario]               = useState('')
  const [password, setPassword]             = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [recordarme, setRecordarme]         = useState(false)
  const [error, setError]                   = useState('')
  const [cargando, setCargando]             = useState(false)

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2044] via-[#1e3a6e] to-[#0f2044] px-4 py-12">

      {/* Patrón de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Barra de acento superior */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#c9a84c] via-[#e8c96e] to-[#c9a84c]" />

        <div className="px-8 py-10">

          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-10">
            {/* Escudo institucional */}
            <div className="w-16 h-16 rounded-2xl bg-[#1e3a6e] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 32 32" className="w-9 h-9" fill="none">
                <path d="M16 3 L20 11 L29 12.5 L22.5 19 L24 28 L16 23.5 L8 28 L9.5 19 L3 12.5 L12 11 Z"
                  fill="#c9a84c" stroke="#c9a84c" strokeWidth="0.5" strokeLinejoin="round"/>
                <circle cx="16" cy="16" r="4" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em]">
                Municipalidad
              </p>
              <h1 className="text-2xl font-black text-[#1e3a6e] tracking-tight leading-none mt-0.5">
                Control de Asistencia
              </h1>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Usuario */}
            <InputField label="Usuario" id="usuario" icon={<IconUser />}>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingrese su usuario"
                required
                autoFocus
                className={INPUT_BASE}
              />
            </InputField>

            {/* Contraseña */}
            <InputField label="Contraseña" id="password" icon={<IconLock />}>
              <input
                id="password"
                type={mostrarPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                className={INPUT_BASE + ' pr-11'}
              />
              {/* Botón ojo — mismo color que el ícono izquierdo */}
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {mostrarPassword ? <IconEyeOpen /> : <IconEyeClosed />}
              </button>
            </InputField>

            {/* Recordarme */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#1e3a6e] cursor-pointer"
              />
              <span className="text-sm text-gray-600">Recordarme</span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 text-red-700 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón principal */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full h-12 rounded-xl bg-[#1e3a6e] hover:bg-[#162d57] active:bg-[#0f2044] text-white font-semibold text-sm tracking-wide border-2 border-[#c9a84c] shadow-lg shadow-[#1e3a6e]/30 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : 'Iniciar Sesión'}
            </button>

            {/* Links secundarios */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <a href="#" className="text-xs text-gray-400 hover:text-[#1e3a6e] transition-colors">
                Olvidé mi contraseña
              </a>
              <span className="text-gray-200">|</span>
              <a href="#" className="text-xs text-gray-400 hover:text-[#1e3a6e] transition-colors">
                Soporte técnico
              </a>
            </div>

          </form>
        </div>

        {/* Footer de la card */}
        <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-center text-gray-400">
            Sistema de Control de Asistencia Municipal
          </p>
        </div>

      </div>
    </div>
  )
}
