require('dotenv/config')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')

const authRoutes = require('./routes/auth.routes')
const trabajadoresRoutes = require('./routes/trabajadores.routes')
const asistenciaRoutes = require('./routes/asistencia.routes')
const areasRoutes = require('./routes/areas.routes')

const app = express()

// Seguridad básica
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rate limiting — máximo 100 requests por 15 minutos por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intentá más tarde.' }
})
app.use(limiter)

// Rate limiting más estricto para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de login, intentá en 15 minutos.' }
})

// Rutas
app.use('/api/auth', loginLimiter, authRoutes)
app.use('/api/trabajadores', trabajadoresRoutes)
app.use('/api/asistencia', asistenciaRoutes)
app.use('/api/areas', areasRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})

module.exports = app
