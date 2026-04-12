import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import EstadoBadge from '../components/EstadoBadge'
import ModalAsistencia from '../components/ModalAsistencia'

/* ─── Inline SVG Icons (Heroicons Outline 24×24, strokeWidth 1.5) ─── */
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
  FileText: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
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
}

/* ─── Sidebar nav items ─── */
const NAV_ITEMS = [
  { icon: Icons.Users, label: 'Trabajadores' },
  { icon: Icons.FileText, label: 'Reportes' },
  { icon: Icons.Settings, label: 'Configuración' },
  { icon: Icons.Help, label: 'Ayuda' },
]

export default function Asistencia() {
  const { fiscal, logout } = useAuth()
  const [registros, setRegistros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null)
  const [fecha, setFecha] = useState('')
  const [filtro, setFiltro] = useState('todos')

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

  const registrosFiltrados = registros
    .filter(r =>
      `${r.apellido} ${r.nombre}`.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.dni.includes(busqueda)
    )
    .filter(r => {
      if (filtro === 'registrados') return r.registro
      if (filtro === 'pendientes') return !r.registro
      return true
    })

  const registrados = registros.filter(r => r.registro).length
  const total = registros.length
  const pendientes = total - registrados
  const porcentaje = total > 0 ? Math.round((registrados / total) * 100) : 0
  const nombreArea = fiscal?.area?.nombre ?? fiscal?.area ?? ''
  const nombreFiscal = fiscal?.nombre ?? ''
  const iniciales = nombreFiscal.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()

  const fechaFormateada = fecha
    ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    : '...'

  return (
    <div className="min-h-screen flex" style={{ background: '#f9f9ff' }}>

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col h-screen w-64 py-6 px-4 gap-2 sticky top-0" style={{ background: '#f9f9ff' }}>
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: '#1a56db' }}>
            <Icons.Building className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight" style={{ color: '#141b2b' }}>Fiscal {nombreArea}</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.05em]" style={{ color: '#737686' }}>Administración</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 font-semibold rounded-lg" style={{ color: '#003fb1', background: '#f1f3ff' }}>
            <Icons.Dashboard className="w-5 h-5" />
            <span className="text-[12px] uppercase tracking-[0.05em]">Dashboard</span>
          </a>
          {NAV_ITEMS.map(({ icon: Icon, label }) => (
            <a key={label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[#f1f3ff]" style={{ color: '#737686' }}>
              <Icon className="w-5 h-5" />
              <span className="text-[12px] uppercase tracking-[0.05em]">{label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <header className="flex justify-between items-center w-full px-6 h-16 bg-white sticky top-0 z-50" style={{ borderTop: '3px solid #1a56db' }}>
          <div className="flex flex-col">
            <span className="text-xl font-bold" style={{ color: '#141b2b' }}>{nombreArea}</span>
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#737686' }}>Fiscal {nombreFiscal}</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-50 transition-colors">
              <Icons.Bell className="w-5 h-5" style={{ color: '#737686' }} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#e9edff', color: '#003fb1' }}>
                {iniciales}
              </div>
              <button onClick={logout} className="flex items-center gap-2 font-medium text-sm transition-colors" style={{ color: '#737686' }}>
                <Icons.Logout className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* Date & Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold" style={{ color: '#141b2b' }}>Asistencia del día</h2>
              <p className="text-sm" style={{ color: '#737686' }}>Gestión de puntualidad y asistencia en tiempo real</p>
            </div>
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
              <Icons.Calendar className="w-5 h-5 mr-2" style={{ color: '#003fb1' }} />
              <span className="font-bold capitalize" style={{ color: '#141b2b' }}>{fechaFormateada}</span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total */}
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(20,27,43,0.04)]" style={{ borderLeft: '4px solid #003fb1' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.05em] mb-2" style={{ color: '#737686' }}>Total Trabajadores</p>
                  <h3 className="text-3xl font-bold" style={{ color: '#141b2b' }}>{total}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,63,177,0.1)', color: '#003fb1' }}>
                  <Icons.Users className="w-5 h-5" />
                </div>
              </div>
            </div>
            {/* Registrados */}
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(20,27,43,0.04)]" style={{ borderLeft: '4px solid #059669' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.05em] mb-2" style={{ color: '#737686' }}>Registrados Hoy</p>
                  <h3 className="text-3xl font-bold" style={{ color: '#059669' }}>{registrados}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Icons.CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>
            {/* Pendientes */}
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(20,27,43,0.04)]" style={{ borderLeft: '4px solid #d97706' }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.05em] mb-2" style={{ color: '#737686' }}>Pendientes</p>
                  <h3 className="text-3xl font-bold" style={{ color: '#d97706' }}>{pendientes}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <Icons.Clock className="w-5 h-5" />
                </div>
              </div>
            </div>
            {/* % Completado */}
            <div className="bg-white p-6 rounded-xl shadow-[0_8px_32px_rgba(20,27,43,0.04)]" style={{ borderLeft: '4px solid #1a56db' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-[0.05em] mb-2" style={{ color: '#737686' }}>% Completado</p>
                  <h3 className="text-3xl font-bold" style={{ color: '#141b2b' }}>{porcentaje}%</h3>
                </div>
                <div className="donut-chart" style={{ background: `conic-gradient(#003fb1 0% ${porcentaje}%, #e9edff ${porcentaje}% 100%)` }}>
                  <span className="z-10 text-[10px] font-bold" style={{ color: '#003fb1' }}>{porcentaje}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium uppercase tracking-wider" style={{ color: '#737686' }}>
              <span>Progreso de Registro</span>
              <span>{porcentaje}% ({registrados}/{total})</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#e1e8fd' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${porcentaje}%`, background: 'linear-gradient(90deg, #003fb1, #1a56db)' }} />
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-xl shadow-[0_4px_16px_rgba(20,27,43,0.02)] flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[260px] relative">
              <Icons.Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#737686' }} />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o DNI..."
                className="w-full rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none transition-all"
                style={{ background: '#f1f3ff', border: 'none' }}
                onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0,63,177,0.2)'}
                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
              />
            </div>
            <div className="flex p-1 rounded-lg" style={{ background: '#f1f3ff' }}>
              {['todos', 'registrados', 'pendientes'].map(f => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                    filtro === f ? 'bg-white font-semibold shadow-sm' : 'hover:bg-white/50'
                  }`}
                  style={{ color: filtro === f ? '#003fb1' : '#737686' }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Worker List or Empty/Loading/Error State */}
          {cargando ? (
            <div className="bg-white rounded-xl flex flex-col items-center justify-center py-24 shadow-[0_8px_32px_rgba(20,27,43,0.04)]">
              <svg className="animate-spin w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" style={{ color: '#003fb1' }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm font-medium" style={{ color: '#737686' }}>Cargando asistencia...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl flex flex-col items-center justify-center py-24 shadow-[0_8px_32px_rgba(20,27,43,0.04)]">
              <Icons.Error className="w-12 h-12 mb-4" style={{ color: '#ba1a1a' }} />
              <p className="text-sm font-medium" style={{ color: '#ba1a1a' }}>{error}</p>
              <button onClick={cargarDia} className="mt-4 px-6 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#003fb1' }}>
                Reintentar
              </button>
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl flex flex-col items-center justify-center py-24 px-8 text-center shadow-[0_8px_32px_rgba(20,27,43,0.04)]">
              <div className="mb-6 p-5 rounded-full" style={{ background: '#f1f3ff' }}>
                <Icons.UserOff className="w-16 h-16" style={{ color: '#737686' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#141b2b' }}>No hay trabajadores asignados</h3>
              <p className="text-sm max-w-sm mb-8" style={{ color: '#737686' }}>
                {busqueda
                  ? 'No se encontraron resultados. Probá con otro término.'
                  : `Los trabajadores del área ${nombreArea} aparecerán aquí una vez registrados.`
                }
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-[0_8px_32px_rgba(20,27,43,0.04)] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto] px-6 py-3" style={{ background: '#f9f9ff', borderBottom: '1px solid #e9edff' }}>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#737686' }}>Trabajador</span>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#737686' }}>Estado</span>
              </div>
              {/* Rows */}
              <ul>
                {registrosFiltrados.map((r, i) => (
                  <li key={r.id} style={{ borderBottom: i < registrosFiltrados.length - 1 ? '1px solid #f1f3ff' : 'none' }}>
                    <button
                      onClick={() => setTrabajadorSeleccionado(r)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#f9f9ff] active:bg-[#f1f3ff] transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center shrink-0 transition-colors"
                          style={{ background: '#e9edff', color: '#003fb1' }}
                        >
                          {r.apellido[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm leading-tight" style={{ color: '#141b2b' }}>
                            {r.apellido}, {r.nombre}
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: '#737686' }}>DNI {r.dni}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <EstadoBadge estado={r.registro?.estado} />
                        <Icons.ChevronRight className="w-4 h-4 transition-colors" style={{ color: '#c3c5d7' }} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
