const authService = require('../services/auth.service')

async function login(req, res) {
  try {
    const { usuario, password } = req.body
    const resultado = await authService.login(usuario, password)
    res.json(resultado)
  } catch (err) {
    const status = err.status || 500
    const message = err.message || 'Error interno del servidor'
    res.status(status).json({ error: message })
  }
}

async function me(req, res) {
  // req.fiscal viene del authMiddleware — datos del token
  res.json({ fiscal: req.fiscal })
}

module.exports = { login, me }
