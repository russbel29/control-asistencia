import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import municipalidadImg from '../assets/login_control_de_asistencia_lima.png'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

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

      {/* Panel izquierdo — foto */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src={municipalidadImg}
          alt="Municipalidad"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-blue-950/30" />
        {/* Escudo watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 100" className="w-64 h-64 text-white fill-current">
            <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" fill="none"/>
            <text x="50" y="55" textAnchor="middle" fontSize="8" fill="white">MUNICIPALIDAD</text>
          </svg>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {/* Escudo SVG inline — estilo Municipalidad de Lima */}
            <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
              <circle cx="24" cy="24" r="23" fill="#1e3a6e" stroke="#c9a84c" strokeWidth="1.5"/>
              <path d="M24 8 L28 16 L38 17 L31 24 L33 34 L24 29 L15 34 L17 24 L10 17 L20 16 Z" fill="#c9a84c"/>
              <circle cx="24" cy="24" r="6" fill="none" stroke="white" strokeWidth="1"/>
            </svg>
            <div className="border-l border-gray-300 pl-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-widest leading-none">Municipalidad de</p>
              <p className="text-2xl font-black text-[#1e3a6e] leading-tight tracking-tight">LIMA</p>
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-[#1e3a6e] text-center mb-8">
            Control de Asistencia
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Campo usuario */}
            <div className="flex items-center border-2 border-[#1e3a6e] rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-r border-[#1e3a6e] bg-white">
                <svg className="w-5 h-5 text-[#1e3a6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="flex-1 px-4">
                <label className="block text-xs text-gray-400 leading-none mt-1">Usuario</label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Ingrese su usuario"
                  required
                  autoFocus
                  className="w-full text-sm text-gray-800 placeholder-gray-300 focus:outline-none pb-1 bg-transparent"
                />
              </div>
            </div>

            {/* Campo contraseña */}
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-r border-gray-200 bg-white">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="flex-1 px-4">
                <label className="block text-xs text-gray-400 leading-none mt-1">Contraseña</label>
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  required
                  className="w-full text-sm text-gray-800 placeholder-gray-300 focus:outline-none pb-1 bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="px-4 text-gray-300 hover:text-gray-500 transition"
              >
                {mostrarPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                )}
              </button>
            </div>

            {/* Recordarme */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="w-4 h-4 accent-[#1e3a6e] rounded"
              />
              <span className="text-sm text-gray-600">Recordarme</span>
            </label>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#1e3a6e] hover:bg-[#162d57] text-white font-semibold py-3.5 rounded-lg border-2 border-[#c9a84c] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide"
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

            {/* Links inferiores */}
            <p className="text-center text-sm text-gray-400 pt-2">
              <a href="#" className="hover:text-[#1e3a6e] transition">Olvidé mi contraseña</a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-[#1e3a6e] transition">Soporte técnico</a>
            </p>

          </form>
        </div>
      </div>

    </div>
  )
}
