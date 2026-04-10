const { Router } = require('express')
const trabajadoresController = require('../controllers/trabajadores.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const areaGuard = require('../middlewares/area-guard.middleware')

const router = Router()

// Todas las rutas de trabajadores requieren autenticación
router.use(authMiddleware)

// GET /api/trabajadores — lista los trabajadores del área del fiscal
router.get('/', trabajadoresController.listar)

// POST /api/trabajadores — crea un nuevo trabajador en el área del fiscal
router.post('/', trabajadoresController.crear)

// GET /api/trabajadores/:trabajadorId — detalle de un trabajador
// PATCH /api/trabajadores/:trabajadorId — activa o desactiva un trabajador
// area-guard verifica que el trabajador pertenece al área antes de pasar al controller
router.get('/:trabajadorId', areaGuard, trabajadoresController.obtener)
router.patch('/:trabajadorId', areaGuard, trabajadoresController.cambiarEstado)

module.exports = router
