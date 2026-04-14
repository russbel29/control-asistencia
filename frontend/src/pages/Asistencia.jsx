import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import EstadoBadge from '../components/EstadoBadge'
import ModalAsistencia from '../components/ModalAsistencia'
import ModalAgregarTrabajador from '../components/ModalAgregarTrabajador'

/* ─── Inline SVG Icons (Heroicons Outline 24×24) ─── */
const Icons = {
  Building: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  Dashboard: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Users: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  FileText: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  Settings: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Help: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
  Bell: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  ),
  Logout: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  ),
  Calendar: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  ),
  Search: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  CheckCircle: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ChevronRight: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  ),
  ChevronLeft: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  ),
  UserOff: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
  ),
  Error: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  UserPlus: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
    </svg>
  ),
  Grid: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  List: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  ),
  Download: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
}

const NAV_ITEMS = [
  { icon: Icons.Users,    label: 'Trabajadores' },
  { icon: Icons.FileText, label: 'Reportes' },
  { icon: Icons.Settings, label: 'Configuración' },
  { icon: Icons.Help,     label: 'Ayuda' },
]

/* ─────────────────────────────────────────────────────────────
   KPI CARD — borde superior de color como en la referencia
───────────────────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, accentColor, iconBg, iconColor, valueColor, children }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8ECF4',
        borderRadius: '12px',
        borderTop: `3px solid ${accentColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        padding: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#8A92A6',
            marginBottom: '8px',
          }}>
            {label}
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1,
            color: valueColor ?? '#1A1F36',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {value}
          </p>
        </div>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {children ?? <Icon style={{ width: '20px', height: '20px' }} />}
        </div>
      </div>
    </div>
  )
}

export default function Asistencia() {
  const { fiscal, logout } = useAuth()
  const [registros, setRegistros]   = useState([])
  const [cargando, setCargando]     = useState(true)
  const [error, setError]           = useState('')
  const [busqueda, setBusqueda]     = useState('')
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null)
  const [fecha, setFecha]           = useState('')
  const [filtro, setFiltro]         = useState('todos')
  const [mostrarAgregar, setMostrarAgregar] = useState(false)

  // fechaConsultada: null = hoy, 'YYYY-MM-DD' = día específico
  const [fechaConsultada, setFechaConsultada] = useState(null)

  // Fecha de hoy en formato YYYY-MM-DD (para comparar y bloquear "→" en hoy)
  const hoyStr = new Date().toISOString().split('T')[0]
  const esHoy  = !fechaConsultada || fechaConsultada === hoyStr

  function irDiaAnterior() {
    const base = fechaConsultada ? new Date(fechaConsultada + 'T12:00:00') : new Date()
    base.setDate(base.getDate() - 1)
    setFechaConsultada(base.toISOString().split('T')[0])
  }

  function irDiaSiguiente() {
    if (esHoy) return  // no navegar al futuro
    const base = new Date(fechaConsultada + 'T12:00:00')
    base.setDate(base.getDate() + 1)
    const nueva = base.toISOString().split('T')[0]
    setFechaConsultada(nueva >= hoyStr ? null : nueva)
  }

  const cargarDia = useCallback(async (fechaParam) => {
    setCargando(true)
    setError('')
    try {
      const url = fechaParam ? `/asistencia/dia?fecha=${fechaParam}` : '/asistencia/dia'
      const { data } = await api.get(url)
      setRegistros(data.registros)
      setFecha(data.fecha)
    } catch {
      setError('No se pudo cargar la asistencia del día')
    } finally {
      setCargando(false)
    }
  }, [])

  // Recargar cuando cambia la fecha consultada
  useEffect(() => { cargarDia(fechaConsultada) }, [cargarDia, fechaConsultada])

  function handleGuardado(nuevoRegistro) {
    setRegistros(prev =>
      prev.map(r =>
        r.id === nuevoRegistro.trabajador.id
          ? { ...r, registro: nuevoRegistro }
          : r
      )
    )
  }

  function handleTrabajadorAgregado() {
    setMostrarAgregar(false)
    cargarDia(fechaConsultada)
  }

  const registrosFiltrados = registros
    .filter(r =>
      `${r.apellido} ${r.nombre}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.dni.includes(busqueda)
    )
    .filter(r => {
      if (filtro === 'registrados') return r.registro
      if (filtro === 'pendientes')  return !r.registro
      return true
    })

  const registrados = registros.filter(r => r.registro).length
  const total       = registros.length
  const pendientes  = total - registrados
  const porcentaje  = total > 0 ? Math.round((registrados / total) * 100) : 0

  const nombreArea   = fiscal?.area?.nombre ?? fiscal?.area ?? ''
  const nombreFiscal = fiscal?.nombre ?? ''
  const iniciales    = nombreFiscal.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  const fechaFormateada = fecha
    ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
        weekday: 'long', day: 'numeric', month: 'long',
      })
    : '...'
  const fechaCap = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1)

  /* Cálculo del donut SVG: circunferencia = 2π × r = 2π × 20 ≈ 125.66 */
  const CIRCUNF = 125.66
  const dashArray = `${(porcentaje / 100) * CIRCUNF} ${CIRCUNF}`

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', background: '#F0F2F8', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside style={{
        display: 'none',
        width: '220px',
        flexShrink: 0,
        background: '#FFFFFF',
        borderRight: '1px solid #E8ECF4',
        padding: '20px 12px',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
      className="md-sidebar"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px', marginBottom: '32px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#1A56DB', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <Icons.Building style={{ width: '18px', height: '18px', color: '#FFFFFF' }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A1F36', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Fiscal {nombreArea}
            </p>
            <p style={{ fontSize: '10px', fontWeight: 500, color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Administración
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <a href="#" style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', borderRadius: '8px',
            background: '#EEF2FF', color: '#1A56DB',
            textDecoration: 'none', fontWeight: 600, fontSize: '13px',
          }}>
            <Icons.Dashboard style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            Dashboard
          </a>
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <a key={label} href="#" style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 12px', borderRadius: '8px',
              color: '#8A92A6', textDecoration: 'none',
              fontWeight: 500, fontSize: '13px',
            }}>
              <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E8ECF4',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}>
          <div>
            <p style={{ fontSize: '17px', fontWeight: 700, color: '#1A1F36', lineHeight: 1.2 }}>
              {nombreArea}
            </p>
            <p style={{ fontSize: '11px', color: '#8A92A6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Fiscal {nombreFiscal}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Bell */}
            <button style={{
              width: '36px', height: '36px', borderRadius: '10px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }} aria-label="Notificaciones">
              <Icons.Bell style={{ width: '20px', height: '20px', color: '#8A92A6' }} />
            </button>
            {/* Avatar */}
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#EEF2FF', color: '#1A56DB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '12px',
            }}>
              {iniciales}
            </div>
            <div style={{ width: '1px', height: '24px', background: '#E8ECF4', margin: '0 4px' }} />
            {/* Logout */}
            <button onClick={logout} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              border: 'none', background: 'transparent', cursor: 'pointer',
              color: '#8A92A6', fontSize: '13px', fontWeight: 500,
            }}>
              <Icons.Logout style={{ width: '16px', height: '16px' }} />
              Salir
            </button>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1F36', margin: 0 }}>
                Asistencia del día
              </h1>
              <p style={{ fontSize: '13px', color: '#8A92A6', marginTop: '4px' }}>
                Gestión de puntualidad y asistencia en tiempo real
              </p>
            </div>
            {/* Date pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#FFFFFF', border: '1px solid #E8ECF4',
              borderRadius: '10px', padding: '8px 14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              <Icons.Calendar style={{ width: '16px', height: '16px', color: '#1A56DB', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1A1F36' }} className="capitalize">
                {fechaCap}
              </span>
              <div style={{ display: 'flex', gap: '2px', marginLeft: '4px' }}>
                <button
                  onClick={irDiaAnterior}
                  style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  aria-label="Día anterior"
                >
                  <Icons.ChevronLeft style={{ width: '14px', height: '14px', color: '#8A92A6' }} />
                </button>
                <button
                  onClick={irDiaSiguiente}
                  disabled={esHoy}
                  style={{ width: '24px', height: '24px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: esHoy ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: esHoy ? 0.3 : 1 }}
                  aria-label="Día siguiente"
                >
                  <Icons.ChevronRight style={{ width: '14px', height: '14px', color: '#8A92A6' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Banner solo lectura — días pasados */}
          {!esHoy && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 16px', borderRadius: '10px',
              background: '#FFF9E6', border: '1px solid #FCD34D',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth={1.5} style={{ width: '18px', height: '18px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p style={{ fontSize: '13px', color: '#92400E', fontWeight: 500, margin: 0 }}>
                Estás viendo un registro histórico — <strong>solo lectura</strong>. Para registrar asistencia usá el día actual.
              </p>
            </div>
          )}

          {/* ── KPI Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>

            {/* Total */}
            <KpiCard label="Total Trabajadores" value={total}
              accentColor="#1A56DB" iconBg="#EEF2FF" iconColor="#1A56DB"
              icon={Icons.Users}
            />

            {/* Registrados */}
            <KpiCard label="Registrados Hoy" value={registrados}
              accentColor="#059669" iconBg="#ECFDF5" iconColor="#059669"
              icon={Icons.CheckCircle} valueColor="#059669"
            />

            {/* Pendientes */}
            <KpiCard label="Pendientes" value={pendientes}
              accentColor="#D97706" iconBg="#FFFBEB" iconColor="#D97706"
              icon={Icons.Clock} valueColor={pendientes > 0 ? '#D97706' : '#1A1F36'}
            />

            {/* % Completado — con donut SVG */}
            <KpiCard label="% Completado" value={`${porcentaje}%`}
              accentColor="#1A56DB" iconBg="transparent" iconColor="#1A56DB"
            >
              <svg width="44" height="44" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="26" cy="26" r="20" fill="none" stroke="#EEF2FF" strokeWidth="6" />
                <circle
                  cx="26" cy="26" r="20" fill="none"
                  stroke="#1A56DB" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={dashArray}
                  style={{ transition: 'stroke-dasharray 0.6s ease' }}
                />
              </svg>
            </KpiCard>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#8A92A6' }}>
                Progreso de Registro
              </span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#8A92A6' }}>
                {porcentaje}% ({registrados}/{total})
              </span>
            </div>
            <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${porcentaje}%`,
                background: 'linear-gradient(90deg, #1A56DB 0%, #3B82F6 100%)',
                borderRadius: '99px',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* Filters row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
              <Icons.Search style={{
                width: '16px', height: '16px',
                position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
                color: '#8A92A6', pointerEvents: 'none',
              }} />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o DNI..."
                style={{
                  width: '100%', padding: '9px 12px 9px 36px',
                  border: '1px solid #E8ECF4', borderRadius: '10px',
                  background: '#FFFFFF', color: '#1A1F36', fontSize: '13px',
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onFocus={e => { e.target.style.borderColor = '#1A56DB'; e.target.style.boxShadow = '0 0 0 3px rgba(26,86,219,0.12)' }}
                onBlur={e  => { e.target.style.borderColor = '#E8ECF4'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
              />
            </div>

            {/* Chip group */}
            <div style={{
              display: 'flex', background: '#FFFFFF',
              border: '1px solid #E8ECF4', borderRadius: '10px', padding: '4px',
            }}>
              {[
                { id: 'todos',       label: 'Todos' },
                { id: 'registrados', label: 'Registrados' },
                { id: 'pendientes',  label: 'Pendientes' },
              ].map(({ id, label }) => (
                <button key={id} onClick={() => setFiltro(id)} style={{
                  padding: '6px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                  background: filtro === id ? '#1A56DB' : 'transparent',
                  color:      filtro === id ? '#FFFFFF' : '#8A92A6',
                  fontWeight: filtro === id ? 600 : 500,
                  fontSize: '13px', transition: 'all 0.15s ease',
                  minHeight: '36px',
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* View toggles */}
            <div style={{
              display: 'flex', background: '#FFFFFF',
              border: '1px solid #E8ECF4', borderRadius: '10px', padding: '4px', gap: '2px',
            }}>
              <button style={{
                width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: '#EEF2FF', color: '#1A56DB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} aria-label="Vista lista">
                <Icons.List style={{ width: '16px', height: '16px' }} />
              </button>
              <button style={{
                width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                background: 'transparent', color: '#8A92A6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }} aria-label="Vista grilla">
                <Icons.Grid style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {/* Agregar Trabajador — solo visible en el día actual */}
            {esHoy && (
              <button
                onClick={() => setMostrarAgregar(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '9px 18px', borderRadius: '10px',
                  border: '1.5px solid #1A56DB',
                  background: '#FFFFFF', color: '#1A56DB',
                  fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1A56DB'; e.currentTarget.style.color = '#FFFFFF' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#1A56DB' }}
              >
                <Icons.UserPlus style={{ width: '16px', height: '16px' }} />
                Agregar
              </button>
            )}

            {/* Export button */}
            <button style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 18px', borderRadius: '10px', border: 'none',
              background: '#1A56DB', color: '#FFFFFF',
              fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(26,86,219,0.25)',
            }}>
              <Icons.Download style={{ width: '16px', height: '16px' }} />
              Exportar
            </button>
          </div>

          {/* Worker list / states */}
          {cargando ? (
            <div style={{
              background: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 24px',
            }}>
              <svg style={{ width: '36px', height: '36px', color: '#1A56DB', marginBottom: '16px', animation: 'spin 1s linear infinite' }}
                   fill="none" viewBox="0 0 24 24">
                <circle style={{ opacity: 0.2 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path style={{ opacity: 0.8 }} fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: '14px', color: '#8A92A6', fontWeight: 500 }}>Cargando asistencia...</p>
            </div>

          ) : error ? (
            <div style={{
              background: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '80px 24px', textAlign: 'center',
            }}>
              <Icons.Error style={{ width: '48px', height: '48px', color: '#E53E3E', marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', color: '#E53E3E', fontWeight: 600, marginBottom: '16px' }}>{error}</p>
              <button onClick={() => cargarDia(fechaConsultada)} style={{
                padding: '10px 24px', borderRadius: '10px', border: 'none',
                background: '#1A56DB', color: '#FFFFFF',
                fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              }}>
                Reintentar
              </button>
            </div>

          ) : registrosFiltrados.length === 0 ? (
            <div style={{
              background: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '12px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '64px 32px', textAlign: 'center',
            }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                background: '#F0F2F8', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '24px',
              }}>
                <Icons.UserOff style={{ width: '48px', height: '48px', color: '#8A92A6' }} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F36', marginBottom: '8px' }}>
                No hay trabajadores asignados
              </h3>
              <p style={{ fontSize: '13px', color: '#8A92A6', maxWidth: '280px', lineHeight: 1.5, marginBottom: '24px' }}>
                {busqueda
                  ? 'No se encontraron resultados. Probá con otro término.'
                  : `Los trabajadores de esta área aparecerán aquí una vez asignados al turno de ${nombreArea.toLowerCase()} de hoy.`}
              </p>
              {!busqueda && (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 24px', borderRadius: '10px', border: 'none',
                  background: '#1A56DB', color: '#FFFFFF',
                  fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(26,86,219,0.25)',
                }}>
                  <Icons.UserPlus style={{ width: '18px', height: '18px' }} />
                  Agregar Trabajadores
                </button>
              )}
            </div>

          ) : (
            <div style={{
              background: '#FFFFFF', border: '1px solid #E8ECF4', borderRadius: '12px',
              overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr auto',
                padding: '10px 20px',
                background: '#F8FAFC', borderBottom: '1px solid #E8ECF4',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A92A6' }}>
                  Trabajador
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8A92A6' }}>
                  Estado
                </span>
              </div>

              {/* Rows */}
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {registrosFiltrados.map((r, i) => (
                  <li key={r.id} style={{
                    borderBottom: i < registrosFiltrados.length - 1 ? '1px solid #F0F4F8' : 'none',
                  }}>
                    <button
                      onClick={() => esHoy && setTrabajadorSeleccionado(r)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', padding: '14px 20px',
                        background: 'transparent', border: 'none',
                        cursor: esHoy ? 'pointer' : 'default',
                        textAlign: 'left', minHeight: '60px',
                      }}
                      onMouseEnter={e => { if (esHoy) e.currentTarget.style.background = '#F8FAFC' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '50%',
                          background: '#EEF2FF', color: '#1A56DB',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '14px', flexShrink: 0,
                        }}>
                          {r.apellido[0]?.toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                           <p style={{
                             fontSize: '14px', fontWeight: 600, color: '#1A1F36',
                             lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                           }}>
                             {r.apellido}, {r.nombre}
                           </p>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                             <p style={{ fontSize: '12px', color: '#8A92A6', margin: 0 }}>
                               DNI {r.dni}
                             </p>
                             {r.modalidad && (
                               <span style={{
                                 fontSize: '10px',
                                 fontWeight: 600,
                                 padding: '1px 6px',
                                 borderRadius: '4px',
                                 background: r.modalidad === 'MOD_728' ? '#EEF2FF' : '#F0FDF4',
                                 color:      r.modalidad === 'MOD_728' ? '#1A56DB' : '#15803D',
                               }}>
                                 {r.modalidad === 'MOD_728' ? '728' : 'CAS'}
                               </span>
                             )}
                           </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: '16px' }}>
                        <EstadoBadge estado={r.registro?.estado} />
                        <Icons.ChevronRight style={{ width: '16px', height: '16px', color: '#C8CEDE' }} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>

      {/* ─── Responsive sidebar CSS ─── */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar { display: flex !important; }
        }
      `}</style>

      {/* Modal asistencia */}
      {trabajadorSeleccionado && (
        <ModalAsistencia
          trabajador={trabajadorSeleccionado}
          onClose={() => setTrabajadorSeleccionado(null)}
          onGuardado={handleGuardado}
        />
      )}

      {/* Modal agregar trabajador */}
      {mostrarAgregar && (
        <ModalAgregarTrabajador
          onClose={() => setMostrarAgregar(false)}
          onAgregado={handleTrabajadorAgregado}
        />
      )}
    </div>
  )
}
