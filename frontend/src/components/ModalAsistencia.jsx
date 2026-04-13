import { useState } from 'react'
import { ESTADOS } from './EstadoBadge'
import api from '../lib/api'

/* ─── Heroicon SVGs por estado (no emojis) ─── */
const ICONOS = {
  PRESENTE: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  AUSENTE: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  DESCANSO_SEMANAL: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  DESCANSO_MEDICO: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  PATERNIDAD: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  VACACIONES: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
}

/* Colores por estado: icono activo y fondo activo */
const ESTADO_COLORS = {
  PRESENTE:         { iconColor: '#1DB070', activeBg: '#E8F8F0', activeBorder: '#1DB070' },
  AUSENTE:          { iconColor: '#E53E3E', activeBg: '#FEF2F2', activeBorder: '#E53E3E' },
  DESCANSO_SEMANAL: { iconColor: '#4A5BDB', activeBg: '#EEF0FB', activeBorder: '#4A5BDB' },
  DESCANSO_MEDICO:  { iconColor: '#F59E0B', activeBg: '#FFF5E6', activeBorder: '#F59E0B' },
  PATERNIDAD:       { iconColor: '#8B5CF6', activeBg: '#F5F3FF', activeBorder: '#8B5CF6' },
  VACACIONES:       { iconColor: '#F97316', activeBg: '#FFF7ED', activeBorder: '#F97316' },
}

export default function ModalAsistencia({ trabajador, onClose, onGuardado }) {
  const [estado,     setEstado]     = useState(trabajador.registro?.estado ?? '')
  const [observacion, setObservacion] = useState(trabajador.registro?.observacion ?? '')
  const [cargando,   setCargando]   = useState(false)
  const [error,      setError]      = useState('')

  async function handleGuardar() {
    if (!estado) { setError('Seleccioná un estado'); return }
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
      className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
      style={{ background: 'rgba(26,31,54,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-md"
        style={{
          background: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.12)',
        }}
        /* Desktop: full rounded */
        onMouseEnter={() => {}}
      >
        <style>{`@media(min-width:640px){.modal-sheet{border-radius:20px!important;box-shadow:0 8px 40px rgba(0,0,0,0.14)!important;}}`}</style>
        <div className="modal-sheet w-full sm:max-w-md" style={{ background: 'transparent' }}>

          {/* Handle (mobile) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ background: '#E8ECF4' }} />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid #E8ECF4' }}>
            <div
              className="w-12 h-12 rounded-2xl font-bold text-lg flex items-center justify-center shrink-0"
              style={{ background: '#EEF0FB', color: '#1A56DB' }}
            >
              {trabajador.apellido[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base leading-tight truncate" style={{ color: '#1A1F36' }}>
                {trabajador.apellido}, {trabajador.nombre}
              </h2>
              <p className="text-xs mt-1" style={{ color: '#8A92A6' }}>Código {trabajador.dni}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-[#F4F6FB] shrink-0"
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#8A92A6' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Estados */}
          <div className="px-6 pt-6 pb-4">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: '#8A92A6' }}>
              Estado del día
            </p>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ESTADOS).map(([valor, { label }]) => {
                const IconoEstado = ICONOS[valor]
                const colors = ESTADO_COLORS[valor] ?? { iconColor: '#1A56DB', activeBg: '#EEF2FF', activeBorder: '#1A56DB' }
                const isActive = estado === valor
                return (
                  <button
                    key={valor}
                    onClick={() => setEstado(valor)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all min-h-[56px]"
                    style={{
                      border:     `2px solid ${isActive ? colors.activeBorder : '#E8ECF4'}`,
                      background: isActive ? colors.activeBg : '#F8FAFC',
                      boxShadow:  isActive ? `0 0 0 3px ${colors.activeBorder}22` : 'none',
                    }}
                  >
                    <IconoEstado
                      className="w-5 h-5 shrink-0"
                      style={{ color: isActive ? colors.iconColor : '#8A92A6' }}
                    />
                    <span
                      className="text-sm font-semibold leading-tight"
                      style={{ color: isActive ? colors.iconColor : '#4A5568' }}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divisor */}
          <div className="mx-6" style={{ borderTop: '1px solid #F0F4F8' }} />

          {/* Observación */}
          <div className="px-6 pt-4 pb-4">
            <label className="block text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#8A92A6' }}>
              Observación <span className="normal-case font-normal tracking-normal">(opcional)</span>
            </label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none transition-all outline-none"
              style={{
                border: '1px solid #E8ECF4',
                background: '#F8FAFC',
                color: '#1A1F36',
                minHeight: '80px',
                lineHeight: '1.5',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#1A56DB'; e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.10)' }}
              onBlur={e  => { e.currentTarget.style.borderColor = '#E8ECF4'; e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.boxShadow = 'none' }}
              placeholder="Ej: Certificado médico presentado"
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="mx-6 mb-3 flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
              style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626' }}
            >
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="px-6 pb-7 pt-2 flex gap-3" style={{ borderTop: '1px solid #F0F4F8' }}>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-colors hover:bg-[#E8ECF4] min-h-[48px]"
              style={{ background: '#F0F4F8', color: '#4A5568' }}
            >
              Cancelar
            </button>
            <button
              onClick={handleGuardar}
              disabled={cargando || !estado}
              className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-opacity flex items-center justify-center gap-2 min-h-[48px] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#1A56DB', color: '#FFFFFF', boxShadow: '0 4px 14px rgba(26,86,219,0.30)' }}
            >
              {cargando ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Guardando...
                </>
              ) : 'Guardar'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
