const asistenciaService = require('../services/asistencia.service')

async function marcar(req, res) {
  try {
    // area-guard ya verificó que el trabajador pertenece al área
    const trabajadorId = parseInt(req.params.trabajadorId)
    const { estado, observacion } = req.body

    const registro = await asistenciaService.marcar(trabajadorId, estado, observacion)

    // 201 si es nuevo, 200 si fue actualizado
    const yaExistia = registro.actualizadoEn > registro.creadoEn
    res.status(yaExistia ? 200 : 201).json({ registro })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

async function obtenerDia(req, res) {
  try {
    const fechaStr = req.query.fecha || null  // YYYY-MM-DD opcional
    const registros = await asistenciaService.obtenerDia(req.fiscal.areaId, fechaStr)

    // Devuelve la fecha consultada (o hoy si no se pasó)
    const fechaRespuesta = fechaStr || new Date().toISOString().split('T')[0]
    res.json({ fecha: fechaRespuesta, registros })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

async function obtenerHistorial(req, res) {
  try {
    const trabajadorId = parseInt(req.params.trabajadorId)
    const { desde, hasta } = req.query

    const historial = await asistenciaService.obtenerHistorial(trabajadorId, desde, hasta)
    res.json({ trabajadorId, historial })
  } catch (err) {
    const status = err.status || 500
    res.status(status).json({ error: err.message || 'Error interno del servidor' })
  }
}

module.exports = { marcar, obtenerDia, obtenerHistorial }
