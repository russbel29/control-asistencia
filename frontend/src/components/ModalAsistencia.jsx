import { useState } from 'react'
import { ESTADOS } from './EstadoBadge'
import api from '../lib/api'

export default function ModalAsistencia({ trabajador, onClose, onGuardado }) {
  const [estado, setEstado] = useState(trabajador.registro?.estado ?? '')
  const [observacion, setObservacion] = useState(trabajador.registro?.observacion ?? '')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleGuardar() {
    if (!estado) {
      setError('Seleccioná un estado')
      return
    }
    setCargando(true)
    setError('')
    try {
      const { data } = await api.post(`/asistencia/${trabajador.id}`, { estado, observacion })
      onGuardado(data.registro)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {trabajador.apellido}, {trabajador.nombre}
          </h2>
          <p className="text-sm text-gray-500">DNI: {trabajador.dni}</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado del día
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ESTADOS).map(([valor, { label, color }]) => (
                <button
                  key={valor}
                  onClick={() => setEstado(valor)}
                  className={`text-sm px-3 py-2 rounded-lg border-2 transition font-medium
                    ${estado === valor
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observación <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={2}
              maxLength={500}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ej: Certificado médico presentado"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={cargando || !estado}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cargando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
