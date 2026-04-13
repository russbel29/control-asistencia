import { useState } from 'react'
import { ESTADOS } from './EstadoBadge'
import api from '../lib/api'

/* ─────────────────────────────────────────────────────────────────────────────
   Íconos SVG filled (solid) — más legibles en estado activo sobre fondo azul
   Fuente: Heroicons solid / Bootstrap Icons adaptados
───────────────────────────────────────────────────────────────────────────── */
const ICONOS = {
  /* Check circle filled */
  PRESENTE: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  ),
  /* X circle filled */
  AUSENTE: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
    </svg>
  ),
  /* Calendar filled */
  DESCANSO_SEMANAL: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
    </svg>
  ),
  /* Plus circle filled (médico) */
  DESCANSO_MEDICO: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clipRule="evenodd" />
    </svg>
  ),
  /* Users filled (paternidad / familia) */
  PATERNIDAD: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ),
  /* Sun filled (vacaciones) */
  VACACIONES: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  ),
}

/* Config de colores por estado — estado inactivo usa grises neutros */
const ESTADO_CFG = {
  PRESENTE:         { color: '#1DB070', bg: '#E8F8F0', border: '#1DB070' },
  AUSENTE:          { color: '#E53E3E', bg: '#FEF2F2', border: '#E53E3E' },
  DESCANSO_SEMANAL: { color: '#1A56DB', bg: '#EEF2FF', border: '#1A56DB' },
  DESCANSO_MEDICO:  { color: '#D97706', bg: '#FFFBEB', border: '#D97706' },
  PATERNIDAD:       { color: '#7C3AED', bg: '#F5F3FF', border: '#7C3AED' },
  VACACIONES:       { color: '#EA580C', bg: '#FFF7ED', border: '#EA580C' },
}

export default function ModalAsistencia({ trabajador, onClose, onGuardado }) {
  const [estado,      setEstado]      = useState(trabajador.registro?.estado ?? '')
  const [observacion, setObservacion] = useState(trabajador.registro?.observacion ?? '')
  const [cargando,    setCargando]    = useState(false)
  const [error,       setError]       = useState('')

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

  /* ID visible: si el dni empieza con PENDING- mostramos "Sin código", si no mostramos el número */
  const idVisible = trabajador.dni?.startsWith('PENDING-')
    ? 'Sin código asignado'
    : `ID: ${trabajador.dni}`

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        background: 'rgba(15,23,42,0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '448px',
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>

        {/* ── Header ── */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Avatar circular sólido azul */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#1A56DB', color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '18px', flexShrink: 0,
                letterSpacing: '-0.02em',
              }}>
                {trabajador.apellido[0]?.toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                  {trabajador.apellido}, {trabajador.nombre}
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
                  {idVisible}
                </p>
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#94A3B8', flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94A3B8' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Estado del Día ── */}
        <div style={{ padding: '20px 24px 0' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px' }}>
            Estado del Día
          </h3>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
            Seleccione una categoría de asistencia
          </p>

          {/* Grid 2×3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.entries(ESTADOS).map(([valor, { label }]) => {
              const Icono = ICONOS[valor]
              const cfg   = ESTADO_CFG[valor] ?? { color: '#1A56DB', bg: '#EEF2FF', border: '#1A56DB' }
              const activo = estado === valor

              return (
                <button
                  key={valor}
                  onClick={() => { setEstado(valor); setError('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', borderRadius: '12px',
                    border: `1.5px solid ${activo ? cfg.border : '#E2E8F0'}`,
                    background: activo ? cfg.color : '#FFFFFF',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.15s ease',
                    minHeight: '52px',
                  }}
                  onMouseEnter={e => {
                    if (!activo) {
                      e.currentTarget.style.borderColor = cfg.border
                      e.currentTarget.style.background = cfg.bg
                    }
                  }}
                  onMouseLeave={e => {
                    if (!activo) {
                      e.currentTarget.style.borderColor = '#E2E8F0'
                      e.currentTarget.style.background = '#FFFFFF'
                    }
                  }}
                >
                  <Icono style={{
                    width: '20px', height: '20px', flexShrink: 0,
                    color: activo ? '#FFFFFF' : cfg.color,
                  }} />
                  <span style={{
                    fontSize: '13px', fontWeight: 600, lineHeight: 1.2,
                    color: activo ? '#FFFFFF' : '#1E293B',
                  }}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Observación ── */}
        <div style={{ padding: '20px 24px 0' }}>
          <label style={{
            display: 'block', fontSize: '11px', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.08em',
            color: '#94A3B8', marginBottom: '8px',
          }}>
            Observación <span style={{ textTransform: 'none', fontWeight: 400, fontSize: '11px' }}>(opcional)</span>
          </label>
          <textarea
            value={observacion}
            onChange={e => setObservacion(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Ingrese detalles adicionales sobre el estado de hoy..."
            style={{
              width: '100%', padding: '12px 14px',
              border: '1.5px solid #E2E8F0', borderRadius: '12px',
              background: '#F8FAFC', color: '#0F172A',
              fontSize: '13px', lineHeight: 1.5,
              resize: 'none', outline: 'none',
              boxSizing: 'border-box', fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
            onFocus={e => {
              e.target.style.borderColor = '#1A56DB'
              e.target.style.background = '#FFFFFF'
              e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.10)'
            }}
            onBlur={e => {
              e.target.style.borderColor = '#E2E8F0'
              e.target.style.background = '#F8FAFC'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            margin: '12px 24px 0',
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', borderRadius: '10px',
            background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626',
            fontSize: '13px', fontWeight: 500,
          }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style={{ flexShrink: 0 }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          padding: '20px 24px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '11px 24px', borderRadius: '10px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, color: '#64748B',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={cargando || !estado}
            style={{
              padding: '11px 32px', borderRadius: '10px',
              border: 'none', cursor: cargando || !estado ? 'not-allowed' : 'pointer',
              background: cargando || !estado ? '#93C5FD' : '#1A56DB',
              color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: cargando || !estado ? 'none' : '0 4px 14px rgba(26,86,219,0.30)',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
              opacity: cargando || !estado ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!cargando && estado) e.currentTarget.style.background = '#1D4ED8' }}
            onMouseLeave={e => { if (!cargando && estado) e.currentTarget.style.background = '#1A56DB' }}
          >
            {cargando ? (
              <>
                <svg style={{ width: '16px', height: '16px', animation: 'modal-spin 1s linear infinite' }}
                     fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Guardando...
              </>
            ) : 'Guardar'}
          </button>
        </div>

        <style>{`@keyframes modal-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
