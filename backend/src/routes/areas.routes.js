const { Router } = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const prisma = require('../lib/prisma')

const router = Router()

router.use(authMiddleware)

// GET /api/areas — lista todas las áreas (solo lectura)
router.get('/', async (req, res) => {
  try {
    const areas = await prisma.area.findMany({
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true }
    })
    res.json({ areas })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /api/areas/mi-area — devuelve el área del fiscal autenticado
router.get('/mi-area', async (req, res) => {
  try {
    const area = await prisma.area.findUnique({
      where: { id: req.fiscal.areaId },
      select: { id: true, nombre: true }
    })
    res.json({ area })
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

module.exports = router
