const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

/**
 * Autentica un fiscal con usuario y contraseña.
 * Devuelve un JWT si las credenciales son válidas.
 */
async function login(usuario, password) {
  if (!usuario || !password) {
    throw { status: 400, message: 'Usuario y contraseña son requeridos' }
  }

  const fiscal = await prisma.fiscal.findUnique({
    where: { usuario },
    include: { area: { select: { id: true, nombre: true } } }
  })

  if (!fiscal || !fiscal.activo) {
    // Mismo mensaje para usuario no encontrado o inactivo — no revelamos cuál es
    throw { status: 401, message: 'Credenciales inválidas' }
  }

  const passwordValido = await bcrypt.compare(password, fiscal.password)

  if (!passwordValido) {
    throw { status: 401, message: 'Credenciales inválidas' }
  }

  const payload = {
    fiscalId: fiscal.id,
    areaId: fiscal.areaId,
    usuario: fiscal.usuario,
    nombre: fiscal.nombre,
    area: fiscal.area.nombre
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h'
  })

  return {
    token,
    fiscal: {
      id: fiscal.id,
      nombre: fiscal.nombre,
      usuario: fiscal.usuario,
      area: fiscal.area
    }
  }
}

module.exports = { login }
