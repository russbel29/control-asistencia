import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import EstadoBadge from '../components/EstadoBadge'
import ModalAsistencia from '../components/ModalAsistencia'

export default function Asistencia() {
  const { fiscal, logout } = useAuth()
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null)
  const [fecha, setFecha] = useState('')

  const cargarDia = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { data } = await api.get('/asistencia/dia')
      setRegistros(data.registros)
      setFecha(data.fecha)
    } catch {
      setError('No se pudo cargar la asistencia del día')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => { cargarDia() }, [cargarDia])

  function handleGuardado(nuevoRegistro) {
    setRegistros(prev =>
      prev.map(r =>
        r.id === nuevoRegistro.trabajador.id
          ? { ...r, registro: nuevoRegistro }
          : r
      )
    )
  }

  const registrosFiltrados = registros.filter(r =>
    `${r.apellido} ${r.nombre}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    r.dni.includes(busqueda)
  )

  const registrados = registros.filter(r => r.registro).length
  const total = registros.length
  const porcentaje = total > 0 ? Math.round((registrados / total) * 100) : 0

  const nombreArea = fiscal?.area?.nombre ?? fiscal?.area ?? ''

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <header className="bg-blue-700 shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{nombreArea}</p>
              <p className="text-blue-200 text-xs">{fiscal?.nombre}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 py-6 flex flex-col gap-4 flex-1">

        {/* Card fecha + progreso */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                Asistencia del día
              </p>
              <p className="text-lg font-bold text-gray-800 capitalize">
                {fecha
                  ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
                      weekday: 'long', day: 'numeric', month: 'long'
                    })
                  : '...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-blue-600 leading-none">{registrados}</p>
              <p className="text-xs text-gray-400 mt-1">de {total} registrados</p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="px-5 pb-4">
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 text-right">{porcentaje}% completado</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o DNI..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Lista */}
        {cargando ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="animate-spin w-8 h-8 mb-3 text-blue-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-sm">Cargando asistencia...</p>
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-600 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="text-sm font-medium">No hay trabajadores</p>
            <p className="text-xs mt-1">
              {busqueda ? 'Probá con otro término de búsqueda' : 'No hay trabajadores en esta área'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2 pb-6">
            {registrosFiltrados.map((r, index) => (
              <li key={r.id}>
                <button
                  onClick={() => setTrabajadorSeleccionado(r)}
                  className="w-full bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md hover:border-blue-100 active:scale-[0.99] transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar con inicial */}
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition">
                      {r.apellido[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm leading-tight">
                        {r.apellido}, {r.nombre}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">DNI {r.dni}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EstadoBadge estado={r.registro?.estado} />
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {/* Modal */}
      {trabajadorSeleccionado && (
        <ModalAsistencia
          trabajador={trabajadorSeleccionado}
          onClose={() => setTrabajadorSeleccionado(null)}
          onGuardado={handleGuardado}
        />
      )}
    </div>
  )
}
