const prisma = require('../lib/prisma')

/**
 * Lista todos los trabajadores activos del área del fiscal autenticado.
 */
async function listar(areaId) {
  return prisma.trabajador.findMany({
    where: { areaId, activo: true },
    orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }],
    select: {
      id: true,
      nombre: true,
      apellido: true,
      dni: true,
      activo: true,
      creadoEn: true
    }
  })
}

/**
 * Obtiene un trabajador por ID (el area-guard ya verificó que pertenece al área).
 */
async function obtener(trabajadorId) {
  return prisma.trabajador.findUnique({
    where: { id: trabajadorId },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      dni: true,
      activo: true,
      creadoEn: true,
      area: { select: { id: true, nombre: true } }
    }
  })
}

/**
 * Crea un nuevo trabajador en el área del fiscal.
 */
async function crear(datos, areaId) {
  const { nombre, apellido, dni } = datos

  if (!nombre?.trim() || !apellido?.trim() || !dni?.trim()) {
    throw { status: 400, message: 'Nombre, apellido y DNI son requeridos' }
  }

  // Verificar que el DNI no exista
  const existente = await prisma.trabajador.findUnique({ where: { dni } })
  if (existente) {
    throw { status: 409, message: 'Ya existe un trabajador con ese DNI' }
  }

  return prisma.trabajador.create({
    data: { nombre: nombre.trim(), apellido: apellido.trim(), dni: dni.trim(), areaId },
    select: { id: true, nombre: true, apellido: true, dni: true, activo: true, creadoEn: true }
  })
}

/**
 * Activa o desactiva un trabajador.
 */
async function cambiarEstado(trabajadorId, activo) {
  return prisma.trabajador.update({
    where: { id: trabajadorId },
    data: { activo },
    select: { id: true, nombre: true, apellido: true, activo: true }
  })
}

module.exports = { listar, obtener, crear, cambiarEstado }
