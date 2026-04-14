import { useState } from 'react'
import api from '../lib/api'

/* ─── Ícono UserPlus (Heroicons outline 24×24) ─── */
const UserPlusIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
)

export default function ModalAgregarTrabajador({ onClose, onAgregado }) {
  const [nombre,    setNombre]    = useState('')
  const [apellido,  setApellido]  = useState('')
  const [codigo,    setCodigo]    = useState('')
  const [modalidad, setModalidad] = useState('CAS')
  const [cargando,  setCargando]  = useState(false)
  const [error,     setError]     = useState('')

  const puedeEnviar = nombre.trim() && apellido.trim() && !cargando

  async function handleAgregar() {
    if (!puedeEnviar) return
    setCargando(true)
    setError('')
    try {
      await api.post('/trabajadores', {
        nombre:    nombre.trim(),
        apellido:  apellido.trim(),
        dni:       codigo.trim() || '',
        modalidad,
      })
      onAgregado()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al agregar el trabajador')
    } finally {
      setCargando(false)
    }
  }

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
              {/* Avatar con ícono UserPlus */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: '#1A56DB', color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <UserPlusIcon style={{ width: '22px', height: '22px' }} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                  Agregar Trabajador
                </h2>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0', fontWeight: 500 }}>
                  Complete los datos del nuevo trabajador
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

        {/* ── Campos del formulario ── */}
        <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Nombre */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#94A3B8', marginBottom: '8px',
            }}>
              Nombre <span style={{ color: '#E53E3E', fontWeight: 700 }}>*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Juan Carlos"
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #E2E8F0', borderRadius: '12px',
                background: '#F8FAFC', color: '#0F172A',
                fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#1A56DB'; e.target.style.background = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.10)' }}
              onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Apellido */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#94A3B8', marginBottom: '8px',
            }}>
              Apellido <span style={{ color: '#E53E3E', fontWeight: 700 }}>*</span>
            </label>
            <input
              type="text"
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              placeholder="Ej: Pérez García"
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #E2E8F0', borderRadius: '12px',
                background: '#F8FAFC', color: '#0F172A',
                fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#1A56DB'; e.target.style.background = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.10)' }}
              onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Código de trabajador (dni — opcional) */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#94A3B8', marginBottom: '8px',
            }}>
              Código de Trabajador{' '}
              <span style={{ textTransform: 'none', fontWeight: 400, fontSize: '11px' }}>(opcional)</span>
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              placeholder="Ej: 255499 — se generará automáticamente si no tiene"
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #E2E8F0', borderRadius: '12px',
                background: '#F8FAFC', color: '#0F172A',
                fontSize: '13px', outline: 'none',
                boxSizing: 'border-box', fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
              onFocus={e => { e.target.style.borderColor = '#1A56DB'; e.target.style.background = '#FFFFFF'; e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.10)' }}
              onBlur={e  => { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; e.target.style.boxShadow = 'none' }}
            />
          </div>

          {/* Modalidad — pill buttons */}
          <div>
            <label style={{
              display: 'block', fontSize: '11px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              color: '#94A3B8', marginBottom: '8px',
            }}>
              Modalidad <span style={{ color: '#E53E3E', fontWeight: 700 }}>*</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { valor: 'CAS',     label: 'CAS' },
                { valor: 'MOD_728', label: '728' },
              ].map(({ valor, label }) => {
                const activo = modalidad === valor
                return (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setModalidad(valor)}
                    style={{
                      padding: '10px 28px',
                      borderRadius: '10px',
                      border: `1.5px solid ${activo ? '#1A56DB' : '#E2E8F0'}`,
                      background: activo ? '#1A56DB' : '#FFFFFF',
                      color: activo ? '#FFFFFF' : '#8A92A6',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                      if (!activo) {
                        e.currentTarget.style.borderColor = '#1A56DB'
                        e.currentTarget.style.color = '#1A56DB'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!activo) {
                        e.currentTarget.style.borderColor = '#E2E8F0'
                        e.currentTarget.style.color = '#8A92A6'
                      }
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
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
            onClick={handleAgregar}
            disabled={!puedeEnviar}
            style={{
              padding: '11px 32px', borderRadius: '10px',
              border: 'none', cursor: !puedeEnviar ? 'not-allowed' : 'pointer',
              background: !puedeEnviar ? '#93C5FD' : '#1A56DB',
              color: '#FFFFFF', fontSize: '14px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: !puedeEnviar ? 'none' : '0 4px 14px rgba(26,86,219,0.30)',
              transition: 'all 0.15s ease', fontFamily: 'inherit',
              opacity: !puedeEnviar ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (puedeEnviar) e.currentTarget.style.background = '#1D4ED8' }}
            onMouseLeave={e => { if (puedeEnviar) e.currentTarget.style.background = '#1A56DB' }}
          >
            {cargando ? (
              <>
                <svg style={{ width: '16px', height: '16px', animation: 'agregar-spin 1s linear infinite' }}
                     fill="none" viewBox="0 0 24 24">
                  <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Agregando...
              </>
            ) : (
              <>
                <UserPlusIcon style={{ width: '16px', height: '16px' }} />
                Agregar
              </>
            )}
          </button>
        </div>

        <style>{`@keyframes agregar-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )
}
