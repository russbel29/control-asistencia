const prisma = require('../lib/prisma')

/**
 * Verifica que el trabajador del request pertenezca al área del fiscal autenticado.
 *
 * USO: aplicar DESPUÉS de authMiddleware en rutas que usan :trabajadorId
 *
 * PREVIENE: IDOR (Insecure Direct Object Reference)
 * Sin este middleware, un fiscal podría acceder a trabajadores de otras áreas
 * simplemente cambiando el ID en la URL.
 *
 * Ejemplo de ataque sin este middleware:
 *   Fiscal del área Barrido (areaId: 1) hace GET /api/trabajadores/50
 *   El trabajador 50 pertenece a Recolección (areaId: 3)
 *   → SIN guard: devuelve los datos del trabajador de otra área ❌
 *   → CON guard: devuelve 403 Forbidden ✅
 */
async function areaGuard(req, res, next) {
  const trabajadorId = parseInt(req.params.trabajadorId)

  if (isNaN(trabajadorId)) {
    return res.status(400).json({ error: 'ID de trabajador inválido' })
  }

  try {
    const trabajador = await prisma.trabajador.findUnique({
      where: { id: trabajadorId },
      select: { areaId: true, activo: true }
    })

    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado' })
    }

    // La verificación clave: ¿el trabajador es de mi área?
    if (trabajador.areaId !== req.fiscal.areaId) {
      return res.status(403).json({ error: 'No tenés permiso para acceder a este trabajador' })
    }

    // Adjuntamos al request para no hacer otra query en el controller
    req.trabajador = trabajador
    next()
  } catch (err) {
    console.error('Error en area-guard:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = areaGuard
