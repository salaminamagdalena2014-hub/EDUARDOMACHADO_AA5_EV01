/**
 * ============================================================
 * CONTROLADOR DE AUTENTICACIÓN
 * Archivo: src/controllers/authController.js
 * ============================================================
 * Descripción: Maneja registro, login y logout de usuarios
 * ============================================================
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_2024';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
const register = async (req, res, next) => {
  try {
    const { nombre, apellido, correo, cedula, contrasena } = req.body;

    // Validar campos obligatorios
    if (!nombre || !apellido || !correo || !cedula || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios',
        data: null,
      });
    }

    // Validar longitud de contraseña
    if (contrasena.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
        data: null,
      });
    }

    // Verificar que el correo no exista
    const usuarioExistente = await usuarioModel.obtenerPorCorreo(correo);
    if (usuarioExistente) {
      return res.status(409).json({
        success: false,
        message: 'El correo ya está registrado',
        data: null,
      });
    }

    // Hashear la contraseña
    const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Crear usuario
    const id_usuario = await usuarioModel.crear(
      nombre,
      apellido,
      correo,
      cedula,
      contrasena_hash
    );

    // Generar JWT
    const token = jwt.sign(
      { id_usuario, correo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id_usuario,
        nombre,
        apellido,
        correo,
        token,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      data: null,
    });
  }
};

/**
 * POST /api/auth/login
 * Iniciar sesión con correo y contraseña
 */
const login = async (req, res, next) => {
  try {
    const { correo, contrasena } = req.body;

    // Validar campos
    if (!correo || !contrasena) {
      return res.status(400).json({
        success: false,
        message: 'Correo y contraseña son obligatorios',
        data: null,
      });
    }

    // Buscar usuario
    const usuario = await usuarioModel.obtenerPorCorreo(correo);
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos',
        data: null,
      });
    }

    // Verificar estado de usuario
    if (usuario.estado === 'inactivo') {
      return res.status(403).json({
        success: false,
        message: 'El usuario está inactivo',
        data: null,
      });
    }

    // Comparar contraseña
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos',
        data: null,
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, correo: usuario.correo },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    res.json({
      success: true,
      message: 'Sesión iniciada exitosamente',
      data: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        token,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      data: null,
    });
  }
};

/**
 * POST /api/auth/logout
 * Cerrar sesión (principalmente informativo en JWT)
 */
const logout = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión',
      data: null,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
