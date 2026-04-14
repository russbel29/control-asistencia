const prisma = require('../lib/prisma')

const ESTADOS_VALIDOS = [
  'PRESENTE',
  'AUSENTE',
  'DESCANSO_SEMANAL',
  'DESCANSO_MEDICO',
  'PATERNIDAD',
  'VACACIONES'
]

const MAX_DIAS_HISTORIAL = 90

/**
 * Registra o actualiza la asistencia de un trabajador para una fecha.
 * Usa upsert con la constraint única [trabajadorId, fecha] — atómico, sin race conditions.
 */
async function marcar(trabajadorId, estado, observacion = null) {
  if (!ESTADOS_VALIDOS.includes(estado)) {
    throw { status: 422, message: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}` }
  }

  // Fecha del servidor en formato YYYY-MM-DD (evita clock skew del cliente)
  const hoy = new Date()
  hoy.setUTCHours(0, 0, 0, 0)

  const registro = await prisma.registroAsistencia.upsert({
    where: {
      trabajadorId_fecha: { trabajadorId, fecha: hoy }
    },
    update: {
      estado,
      observacion: observacion?.trim() || null
    },
    create: {
      trabajadorId,
      fecha: hoy,
      estado,
      observacion: observacion?.trim() || null
    },
    select: {
      id: true,
      fecha: true,
      estado: true,
      observacion: true,
      actualizadoEn: true,
      trabajador: { select: { id: true, nombre: true, apellido: true } }
    }
  })

  return registro
}

/**
 * Obtiene el registro de asistencia de una fecha para todos los trabajadores del área.
 * Si no se pasa fecha, usa el día actual del servidor.
 * @param {number} areaId
 * @param {string|null} fechaStr - formato YYYY-MM-DD (opcional)
 */
async function obtenerDia(areaId, fechaStr = null) {
  let fecha

  if (fechaStr) {
    // Validar formato YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      throw { status: 400, message: 'Formato de fecha inválido. Usá YYYY-MM-DD' }
    }
    fecha = new Date(fechaStr + 'T00:00:00.000Z')
    if (isNaN(fecha.getTime())) {
      throw { status: 400, message: 'Fecha inválida' }
    }

    // No permitir fechas futuras
    const hoy = new Date()
    hoy.setUTCHours(0, 0, 0, 0)
    if (fecha > hoy) {
      throw { status: 400, message: 'No se pueden consultar fechas futuras' }
    }
  } else {
    fecha = new Date()
    fecha.setUTCHours(0, 0, 0, 0)
  }

  const trabajadores = await prisma.trabajador.findMany({
    where: { areaId, activo: true },
    orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    select: {
      id: true,
      nombre: true,
      apellido: true,
      dni: true,
      modalidad: true,
      registros: {
        where: { fecha },
        select: { id: true, estado: true, observacion: true, actualizadoEn: true }
      }
    }
  })

  // Normalizar: cada trabajador tiene su registro del día o null
  return trabajadores.map(t => ({
    id: t.id,
    nombre: t.nombre,
    apellido: t.apellido,
    dni: t.dni,
    modalidad: t.modalidad,
    registro: t.registros[0] || null
  }))
}

/**
 * Obtiene el historial de asistencia de un trabajador.
 * Máximo 90 días para no sobrecargar la respuesta.
 */
async function obtenerHistorial(trabajadorId, desde, hasta) {
  const fechaHasta = hasta ? new Date(hasta) : new Date()
  fechaHasta.setUTCHours(0, 0, 0, 0)

  const fechaDesde = desde
    ? new Date(desde)
    : new Date(fechaHasta.getTime() - MAX_DIAS_HISTORIAL * 24 * 60 * 60 * 1000)
  fechaDesde.setUTCHours(0, 0, 0, 0)

  // Validar rango máximo
  const diffDias = (fechaHasta - fechaDesde) / (1000 * 60 * 60 * 24)
  if (diffDias > MAX_DIAS_HISTORIAL) {
    throw { status: 400, message: `El rango máximo es ${MAX_DIAS_HISTORIAL} días` }
  }

  return prisma.registroAsistencia.findMany({
    where: {
      trabajadorId,
      fecha: { gte: fechaDesde, lte: fechaHasta }
    },
    orderBy: { fecha: 'desc' },
    select: {
      id: true,
      fecha: true,
      estado: true,
      observacion: true,
      actualizadoEn: true
    }
  })
}

module.exports = { marcar, obtenerDia, obtenerHistorial }
