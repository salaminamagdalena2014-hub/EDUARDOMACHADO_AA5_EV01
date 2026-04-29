/**
 * ============================================================
 * RUTAS DE USUARIOS
 * Archivo: routes/usuariosRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de usuarios
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middleware/authMiddleware');
const {
  obtenerPerfil,
  actualizar,
  cambiarContrasena,
  desactivar,
} = require('../controllers/usuariosController');

/**
 * @route   GET /api/usuarios/:id
 * @desc    Obtener perfil del usuario
 * @access  Privado
 */
router.get('/:id', verificarToken, obtenerPerfil);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualizar perfil del usuario
 * @access  Privado
 */
router.put('/:id', verificarToken, actualizar);

/**
 * @route   PUT /api/usuarios/:id/password
 * @desc    Cambiar contraseña
 * @access  Privado
 */
router.put('/:id/password', verificarToken, cambiarContrasena);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Desactivar cuenta
 * @access  Privado
 */
router.delete('/:id', verificarToken, desactivar);

module.exports = router;
