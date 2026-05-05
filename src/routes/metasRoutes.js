/**
 * ============================================================
 * RUTAS DE METAS DE AHORRO
 * Archivo: routes/metasRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de metas y sus transacciones asociadas
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
  cancelar,
  asociarTransaccion,
  desasociarTransaccion,
} = require('../controllers/metasController');

/**
 * @route   GET /api/metas
 * @desc    Listar metas del usuario
 * @access  Privado
 */
router.get('/', verificarToken, listar);

/**
 * @route   GET /api/metas/:id
 * @desc    Obtener una meta
 * @access  Privado
 */
router.get('/:id', verificarToken, obtener);

/**
 * @route   POST /api/metas
 * @desc    Crear meta de ahorro
 * @access  Privado
 */
router.post('/', verificarToken, crear);

/**
 * @route   PUT /api/metas/:id
 * @desc    Actualizar meta
 * @access  Privado
 */
router.put('/:id', verificarToken, actualizar);

/**
 * @route   DELETE /api/metas/:id
 * @desc    Cancelar meta
 * @access  Privado
 */
router.delete('/:id', verificarToken, cancelar);

/**
 * @route   POST /api/metas/:id/transacciones
 * @desc    Asociar transacción a una meta
 * @access  Privado
 */
router.post('/:id/transacciones', verificarToken, asociarTransaccion);

/**
 * @route   DELETE /api/metas/:id/transacciones/:id_transaccion
 * @desc    Desasociar transacción de una meta
 * @access  Privado
 */
router.delete('/:id/transacciones/:id_transaccion', verificarToken, desasociarTransaccion);

module.exports = router;
