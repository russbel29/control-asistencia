const trabajadoresService = require('../services/trabajadores.service')

async function listar(req, res) {
  try {
    const trabajadores = await trabajadoresService.listar(req.fiscal.areaId)
    res.json({ trabajadores })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

async function obtener(req, res) {
  try {
    // area-guard ya verificó que el trabajador pertenece al área
    const trabajadorId = parseInt(req.params.trabajadorId)
    const trabajador = await trabajadoresService.obtener(trabajadorId)
    res.json({ trabajador })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

async function crear(req, res) {
  try {
    const trabajador = await trabajadoresService.crear(req.body, req.fiscal.areaId)
    res.status(201).json({ trabajador })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

async function cambiarEstado(req, res) {
  try {
    const trabajadorId = parseInt(req.params.trabajadorId)
    const { activo } = req.body

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ error: 'El campo "activo" debe ser true o false' })
    }

    const trabajador = await trabajadoresService.cambiarEstado(trabajadorId, activo)
    res.json({ trabajador })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

module.exports = { listar, obtener, crear, cambiarEstado }
