/**
 * ============================================================
 * RUTAS DE CATEGORÍAS
 * Archivo: routes/categoriasRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de categorías
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const {
  listar,
  crear,
  actualizar,
  eliminar,
} = require('../controllers/categoriasController');

/**
 * @route   GET /api/categorias
 * @desc    Listar categorías del sistema + personalizadas
 * @access  Privado
 */
router.get('/', verificarToken, listar);

/**
 * @route   POST /api/categorias
 * @desc    Crear categoría personalizada
 * @access  Privado
 */
router.post('/', verificarToken, crear);

/**
 * @route   PUT /api/categorias/:id
 * @desc    Actualizar categoría personalizada
 * @access  Privado
 */
router.put('/:id', verificarToken, actualizar);

/**
 * @route   DELETE /api/categorias/:id
 * @desc    Eliminar categoría personalizada
 * @access  Privado
 */
router.delete('/:id', verificarToken, eliminar);

module.exports = router;
