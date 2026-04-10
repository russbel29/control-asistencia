const { Router } = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = Router()

// POST /api/auth/login
router.post('/login', authController.login)

// GET /api/auth/me — verifica token y devuelve datos del fiscal
router.get('/me', authMiddleware, authController.me)

module.exports = router
