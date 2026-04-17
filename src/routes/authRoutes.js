/**
 * ============================================================
 * RUTAS DE AUTENTICACIÓN
 * Archivo: routes/authRoutes.js
 * ============================================================
 * Descripción: Define los endpoints del servicio web de
 * autenticación y los conecta con sus controladores.
 *
 * Endpoints disponibles:
 *   POST /api/auth/registro  → Registrar nuevo usuario
 *   POST /api/auth/login     → Iniciar sesión
 * ============================================================
 */

const express = require('express');
const router = express.Router(); // Creamos un enrutador de Express

// Importamos los controladores que manejan la lógica de negocio
const { registrar, iniciarSesion } = require('../controllers/authController');

// ─── DEFINICIÓN DE RUTAS ──────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/registro
 * @desc    Registrar un nuevo usuario en el sistema
 * @access  Público
 * @body    { usuario: string, contrasena: string }
 */
router.post('/registro', registrar);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión con credenciales existentes
 * @access  Público
 * @body    { usuario: string, contrasena: string }
 */
router.post('/login', iniciarSesion);

module.exports = router;
