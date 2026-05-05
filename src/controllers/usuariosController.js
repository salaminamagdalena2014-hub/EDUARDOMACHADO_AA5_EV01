/**
 * ============================================================
 * CONTROLADOR DE USUARIOS
 * Archivo: src/controllers/usuariosController.js
 * ============================================================
 * Descripción: Maneja perfil, actualización y eliminación de usuarios
 * ============================================================
 */

const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const SALT_ROUNDS = 10;

/**
 * GET /api/usuarios/:id
 * Obtener perfil del usuario autenticado
 */
const obtenerPerfil = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario: usuarioAutenticado } = req.usuario;

    // Validar que el usuario solo pueda ver su propio perfil
    if (parseInt(id) !== usuarioAutenticado) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a este recurso',
        data: null,
      });
    }

    const usuario = await usuarioModel.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Perfil obtenido exitosamente',
      data: usuario,
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      data: null,
    });
  }
};

/**
 * PUT /api/usuarios/:id
 * Actualizar datos del usuario (sin contraseña)
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, cedula } = req.body;
    const { id_usuario: usuarioAutenticado } = req.usuario;

    // Validar permisos
    if (parseInt(id) !== usuarioAutenticado) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar este perfil',
        data: null,
      });
    }

    // Validar campos obligatorios
    if (!nombre || !apellido || !cedula) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido y cédula son obligatorios',
        data: null,
      });
    }

    // Preparar datos de actualización
    const datosActualizar = {
      nombre,
      apellido,
      cedula,
    };

    // Actualizar usuario
    const actualizado = await usuarioModel.actualizar(id, datosActualizar);
    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    const usuario = await usuarioModel.obtenerPorId(id);

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuario,
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      data: null,
    });
  }
};

/**
 * PUT /api/usuarios/:id/password
 * Cambiar contraseña (verificar actual + hashear nueva)
 */
const cambiarContrasena = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contrasena_actual, contrasena_nueva, contrasena_confirmar } = req.body;
    const { id_usuario: usuarioAutenticado } = req.usuario;

    // Validar permisos
    if (parseInt(id) !== usuarioAutenticado) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para cambiar esta contraseña',
        data: null,
      });
    }

    // Validar campos
    if (!contrasena_actual || !contrasena_nueva || !contrasena_confirmar) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos de contraseña son obligatorios',
        data: null,
      });
    }

    // Validar que las nuevas contraseñas coincidan
    if (contrasena_nueva !== contrasena_confirmar) {
      return res.status(400).json({
        success: false,
        message: 'Las nuevas contraseñas no coinciden',
        data: null,
      });
    }

    // Validar longitud
    if (contrasena_nueva.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres',
        data: null,
      });
    }

    // Obtener usuario
    const usuario = await usuarioModel.obtenerPorCorreo(req.usuario.correo);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    // Verificar contraseña actual
    const contrasenaValida = await bcrypt.compare(contrasena_actual, usuario.contrasena_hash);
    if (!contrasenaValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual es incorrecta',
        data: null,
      });
    }

    // Hashear nueva contraseña
    const nueva_hash = await bcrypt.hash(contrasena_nueva, SALT_ROUNDS);

    // Actualizar contraseña
    const actualizado = await usuarioModel.actualizarContrasena(id, nueva_hash);
    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      data: null,
    });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Desactivar cuenta (cambiar estado a 'inactivo')
 */
const desactivar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario: usuarioAutenticado } = req.usuario;

    // Validar permisos
    if (parseInt(id) !== usuarioAutenticado) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para desactivar este usuario',
        data: null,
      });
    }

    // Desactivar usuario
    const desactivado = await usuarioModel.desactivar(id);
    if (!desactivado) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Cuenta desactivada exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error al desactivar cuenta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar cuenta',
      data: null,
    });
  }
};

module.exports = {
  obtenerPerfil,
  actualizar,
  cambiarContrasena,
  desactivar,
};
