const jwt = require('jsonwebtoken')

/**
 * Verifica que el request tenga un JWT válido.
 * Si es válido, agrega req.fiscal con los datos del fiscal autenticado.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // payload tiene: { fiscalId, areaId, usuario }
    req.fiscal = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

module.exports = authMiddleware
