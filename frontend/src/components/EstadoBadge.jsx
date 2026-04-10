const ESTADOS = {
  PRESENTE:        { label: 'Presente',         color: 'bg-green-100 text-green-800' },
  AUSENTE:         { label: 'Ausente',           color: 'bg-red-100 text-red-800' },
  DESCANSO_SEMANAL:{ label: 'Descanso Semanal',  color: 'bg-blue-100 text-blue-800' },
  DESCANSO_MEDICO: { label: 'Descanso Médico',   color: 'bg-yellow-100 text-yellow-800' },
  PATERNIDAD:      { label: 'Paternidad',        color: 'bg-purple-100 text-purple-800' },
  VACACIONES:      { label: 'Vacaciones',        color: 'bg-orange-100 text-orange-800' },
}

export default function EstadoBadge({ estado }) {
  if (!estado) {
    return (
      <span className="inline-block bg-gray-100 text-gray-500 text-xs font-medium px-2.5 py-1 rounded-full">
        Sin registrar
      </span>
    )
  }

  const { label, color } = ESTADOS[estado] ?? { label: estado, color: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
      {label}
    </span>
  )
}

// Exportamos los estados para usarlos en el selector
export { ESTADOS }
