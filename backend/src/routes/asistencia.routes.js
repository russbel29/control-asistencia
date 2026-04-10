const { Router } = require('express')
const asistenciaController = require('../controllers/asistencia.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const areaGuard = require('../middlewares/area-guard.middleware')

const router = Router()

router.use(authMiddleware)

// GET /api/asistencia/dia — registro del día para todos los trabajadores del área
router.get('/dia', asistenciaController.obtenerDia)

// POST /api/asistencia/:trabajadorId — marca o actualiza asistencia del día
router.post('/:trabajadorId', areaGuard, asistenciaController.marcar)

// GET /api/asistencia/:trabajadorId/historial?desde=YYYY-MM-DD&hasta=YYYY-MM-DD
router.get('/:trabajadorId/historial', areaGuard, asistenciaController.obtenerHistorial)

module.exports = router
