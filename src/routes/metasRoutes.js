/**
 * ============================================================
 * RUTAS DE TRANSACCIONES
 * Archivo: routes/transaccionesRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de transacciones
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
} = require('../controllers/transaccionesController');

/**
 * @route   GET /api/transacciones
 * @desc    Listar transacciones con filtros opcionales
 * @access  Privado
 * @query   { tipo, id_categoria, fecha_inicio, fecha_fin }
 */
router.get('/', verificarToken, listar);

/**
 * @route   GET /api/transacciones/:id
 * @desc    Obtener una transacción
 * @access  Privado
 */
router.get('/:id', verificarToken, obtener);

/**
 * @route   POST /api/transacciones
 * @desc    Crear transacción
 * @access  Privado
 */
router.post('/', verificarToken, crear);

/**
 * @route   PUT /api/transacciones/:id
 * @desc    Actualizar transacción
 * @access  Privado
 */
router.put('/:id', verificarToken, actualizar);

/**
 * @route   DELETE /api/transacciones/:id
 * @desc    Eliminar transacción
 * @access  Privado
 */
router.delete('/:id', verificarToken, eliminar);

module.exports = router;
