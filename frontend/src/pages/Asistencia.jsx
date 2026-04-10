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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-800">{fiscal?.area?.nombre ?? fiscal?.area}</h1>
            <p className="text-xs text-gray-500">{fiscal?.nombre}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-red-600 transition"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Fecha y progreso */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Asistencia del día</p>
            <p className="font-semibold text-gray-800">
              {fecha ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
                weekday: 'long', day: 'numeric', month: 'long'
              }) : '...'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{registrados}</p>
            <p className="text-xs text-gray-500">de {total} registrados</p>
          </div>
        </div>

        {/* Buscador */}
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o DNI..."
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Lista */}
        {cargando ? (
          <div className="text-center py-12 text-gray-400">Cargando...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : registrosFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay trabajadores</div>
        ) : (
          <ul className="space-y-2">
            {registrosFiltrados.map(r => (
              <li key={r.id}>
                <button
                  onClick={() => setTrabajadorSeleccionado(r)}
                  className="w-full bg-white rounded-xl px-4 py-3 shadow-sm flex items-center justify-between hover:shadow-md transition text-left"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {r.apellido}, {r.nombre}
                    </p>
                    <p className="text-xs text-gray-400">DNI {r.dni}</p>
                  </div>
                  <EstadoBadge estado={r.registro?.estado} />
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
