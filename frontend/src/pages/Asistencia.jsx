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
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-tight" style={{ color: '#141b2b' }}>Fiscal {nombreArea}</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.05em]" style={{ color: '#737686' }}>Administración</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 font-semibold rounded-lg" style={{ color: '#003fb1', background: '#f1f3ff' }}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[12px] uppercase tracking-[0.05em]">Dashboard</span>
          </a>
          {[
            { icon: 'group', label: 'Trabajadores' },
            { icon: 'description', label: 'Reportes' },
            { icon: 'settings', label: 'Configuración' },
            { icon: 'help', label: 'Ayuda' },
          ].map(({ icon, label }) => (
            <a key={label} href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-[#f1f3ff]" style={{ color: '#737686' }}>
              <span className="material-symbols-outlined">{icon}</span>
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
              <span className="material-symbols-outlined" style={{ color: '#737686' }}>notifications</span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: '#e9edff', color: '#003fb1' }}>
                {iniciales}
              </div>
              <button onClick={logout} className="flex items-center gap-2 font-medium text-sm transition-colors" style={{ color: '#737686' }}>
                <span className="material-symbols-outlined text-[20px]">logout</span>
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
              <span className="material-symbols-outlined mr-2" style={{ color: '#003fb1' }}>calendar_today</span>
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
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
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
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
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
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
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
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#737686' }}>search</span>
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
              <span className="material-symbols-outlined text-[48px] mb-4" style={{ color: '#ba1a1a' }}>error</span>
              <p className="text-sm font-medium" style={{ color: '#ba1a1a' }}>{error}</p>
              <button onClick={cargarDia} className="mt-4 px-6 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#003fb1' }}>
                Reintentar
              </button>
            </div>
          ) : registrosFiltrados.length === 0 ? (
            <div className="bg-white rounded-xl flex flex-col items-center justify-center py-24 px-8 text-center shadow-[0_8px_32px_rgba(20,27,43,0.04)]">
              <div className="mb-6 p-5 rounded-full" style={{ background: '#f1f3ff' }}>
                <span className="material-symbols-outlined text-[64px]" style={{ color: '#737686' }}>group_off</span>
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
                        <span className="material-symbols-outlined text-[18px] transition-colors" style={{ color: '#c3c5d7' }}>chevron_right</span>
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
