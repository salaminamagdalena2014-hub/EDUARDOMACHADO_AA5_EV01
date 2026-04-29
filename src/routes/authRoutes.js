/**
 * ============================================================
 * RUTAS DE AUTENTICACIÓN
 * Archivo: routes/authRoutes.js
 * ============================================================
 * Descripción: Define los endpoints de autenticación
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Público
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Privado
 */
router.post('/logout', verificarToken, logout);

module.exports = router;
