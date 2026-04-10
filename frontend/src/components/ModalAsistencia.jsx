import { useState } from 'react'
import { ESTADOS } from './EstadoBadge'
import api from '../lib/api'

const ICONOS = {
  PRESENTE:         '✅',
  AUSENTE:          '❌',
  DESCANSO_SEMANAL: '😴',
  DESCANSO_MEDICO:  '🏥',
  PATERNIDAD:       '👶',
  VACACIONES:       '🏖️',
}

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
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md">

        {/* Handle para mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg flex items-center justify-center shrink-0">
            {trabajador.apellido[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-800 leading-tight truncate">
              {trabajador.apellido}, {trabajador.nombre}
            </h2>
            <p className="text-sm text-gray-400">DNI {trabajador.dni}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Estados */}
        <div className="px-6 pt-5 pb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Estado del día
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(ESTADOS).map(([valor, { label }]) => (
              <button
                key={valor}
                onClick={() => setEstado(valor)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition text-left
                  ${estado === valor
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
              >
                <span className="text-xl leading-none">{ICONOS[valor]}</span>
                <span className={`text-sm font-medium leading-tight ${estado === valor ? 'text-blue-700' : 'text-gray-700'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Observación */}
        <div className="px-6 pb-4">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Observación <span className="normal-case font-normal">(opcional)</span>
          </label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition"
            placeholder="Ej: Certificado médico presentado"
          />
        </div>

        {error && (
          <div className="mx-6 mb-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Acciones */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={cargando || !estado}
            className="flex-2 px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {cargando ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Guardando...
              </>
            ) : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}
