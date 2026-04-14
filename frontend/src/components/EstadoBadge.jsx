/* Colores alineados con el design system (Slate Sync palette) */
const ESTADOS = {
  PRESENTE:         { label: 'Presente',        bg: '#E8F8F0', color: '#1DB070' },
  AUSENTE:          { label: 'Ausente',          bg: '#FEF2F2', color: '#E53E3E' },
  DESCANSO_SEMANAL: { label: 'Descanso Semanal', bg: '#EEF0FB', color: '#4A5BDB' },
  DESCANSO_MEDICO:  { label: 'Descanso Médico',  bg: '#FFF5E6', color: '#F59E0B' },
  PATERNIDAD:       { label: 'Paternidad',       bg: '#F5F3FF', color: '#8B5CF6' },
  VACACIONES:       { label: 'Vacaciones',       bg: '#FFF7ED', color: '#F97316' },
}

export default function EstadoBadge({ estado }) {
  if (!estado) {
    return (
      <span
        className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: '#F4F6FB', color: '#8A92A6' }}
      >
        Sin registrar
      </span>
    )
  }

  const { label, bg, color } = ESTADOS[estado] ?? { label: estado, bg: '#F4F6FB', color: '#8A92A6' }

  return (
    <span
      className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  )
}

export { ESTADOS }
