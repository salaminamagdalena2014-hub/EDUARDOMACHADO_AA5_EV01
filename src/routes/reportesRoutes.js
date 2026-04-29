/**
 * ============================================================
 * RUTAS DE REPORTES
 * Archivo: routes/reportesRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de reportes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const {
  resumenMensual,
  gastosPorCategoria,
  progresoMetas,
} = require('../controllers/reportesController');

/**
 * @route   GET /api/reportes/resumen-mensual
 * @desc    Resumen de ingresos, gastos y balance por mes
 * @access  Privado
 */
router.get('/resumen-mensual', verificarToken, resumenMensual);

/**
 * @route   GET /api/reportes/gastos-por-categoria
 * @desc    Total de gastos agrupados por categoría
 * @access  Privado
 */
router.get('/gastos-por-categoria', verificarToken, gastosPorCategoria);

/**
 * @route   GET /api/reportes/progreso-metas
 * @desc    Estado y progreso de metas del usuario
 * @access  Privado
 */
router.get('/progreso-metas', verificarToken, progresoMetas);

module.exports = router;
