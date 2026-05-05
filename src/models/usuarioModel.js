/**
 * ============================================================
 * MODELO DE USUARIOS
 * Archivo: models/usuarioModel.js
 * ============================================================
 * Descripción: Maneja operaciones CRUD de usuarios con MySQL
 * ============================================================
 */

const pool = require('../config/database');

/**
 * Obtener usuario por correo electrónico
 * @param {string} correo - Correo del usuario
 * @returns {Object|null} Usuario encontrado o null
 */
const obtenerPorCorreo = async (correo) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nombre, apellido, correo, cedula, contrasena_hash, estado, fecha_registro FROM usuario WHERE correo = ?',
      [correo]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error al obtener usuario por correo:', error);
    throw error;
  }
};

/**
 * Obtener usuario por ID
 * @param {number} id_usuario - ID del usuario
 * @returns {Object|null} Usuario encontrado o null
 */
const obtenerPorId = async (id_usuario) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id_usuario, nombre, apellido, correo, cedula, estado, fecha_registro FROM usuario WHERE id_usuario = ?',
      [id_usuario]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

/**
 * Crear nuevo usuario
 * @param {string} nombre - Nombre del usuario
 * @param {string} apellido - Apellido del usuario
 * @param {string} correo - Correo electrónico
 * @param {string} cedula - Cédula
 * @param {string} contrasena_hash - Contraseña hasheada
 * @returns {number} ID del usuario creado
 */
const crear = async (nombre, apellido, correo, cedula, contrasena_hash) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO usuario (nombre, apellido, correo, cedula, contrasena_hash) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, correo, cedula, contrasena_hash]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

/**
 * Actualizar usuario
 * @param {number} id_usuario - ID del usuario
 * @param {Object} datos - Datos a actualizar
 * @returns {boolean} True si se actualizó correctamente
 */
const actualizar = async (id_usuario, datos) => {
  try {
    const campos = [];
    const valores = [];

    if (datos.nombre) {
      campos.push('nombre = ?');
      valores.push(datos.nombre);
    }
    if (datos.apellido) {
      campos.push('apellido = ?');
      valores.push(datos.apellido);
    }
    if (datos.correo) {
      campos.push('correo = ?');
      valores.push(datos.correo);
    }
    if (datos.cedula) {
      campos.push('cedula = ?');
      valores.push(datos.cedula);
    }
    if (datos.contrasena_hash) {
      campos.push('contrasena_hash = ?');
      valores.push(datos.contrasena_hash);
    }
    if (datos.estado) {
      campos.push('estado = ?');
      valores.push(datos.estado);
    }

    if (campos.length === 0) return false;

    valores.push(id_usuario);

    const [result] = await pool.execute(
      `UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`,
      valores
    );

    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Desactivar usuario (cambiar estado a inactivo)
 * @param {number} id_usuario - ID del usuario
 * @returns {boolean} True si se desactivó correctamente
 */
const desactivar = async (id_usuario) => {
  try {
    const [result] = await pool.execute(
      'UPDATE usuario SET estado = ? WHERE id_usuario = ?',
      ['inactivo', id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error al desactivar usuario:', error);
    throw error;
  }
};

module.exports = {
  obtenerPorCorreo,
  obtenerPorId,
  crear,
  actualizar,
  desactivar,
};
