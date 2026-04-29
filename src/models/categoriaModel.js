/**
 * ============================================================
 * MODELO DE CATEGORÍAS
 * Archivo: src/models/categoriaModel.js
 * ============================================================
 * Descripción: Maneja todas las operaciones CRUD de categorías
 * ============================================================
 */

const pool = require('../config/database');

/**
 * Obtener todas las categorías del sistema + las del usuario
 */
const obtenerPorUsuario = async (id_usuario) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM categoria 
       WHERE es_sistema = 1 OR id_usuario = ? 
       ORDER BY tipo, nombre`,
      [id_usuario]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una categoría por ID (verificar que pertenezca al usuario o sea del sistema)
 */
const obtenerPorId = async (id_categoria, id_usuario) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM categoria 
       WHERE id_categoria = ? AND (es_sistema = 1 OR id_usuario = ?)`,
      [id_categoria, id_usuario]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva categoría personalizada
 */
const crear = async (id_usuario, nombre, tipo, color, icono) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO categoria (id_usuario, nombre, tipo, color, icono, es_sistema) VALUES (?, ?, ?, ?, ?, 0)',
      [id_usuario, nombre, tipo, color, icono]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una categoría personalizada
 */
const actualizar = async (id_categoria, id_usuario, nombre, tipo, color, icono) => {
  try {
    const [result] = await pool.query(
      `UPDATE categoria 
       SET nombre = ?, tipo = ?, color = ?, icono = ? 
       WHERE id_categoria = ? AND id_usuario = ? AND es_sistema = 0`,
      [nombre, tipo, color, icono, id_categoria, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una categoría personalizada
 */
const eliminar = async (id_categoria, id_usuario) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM categoria 
       WHERE id_categoria = ? AND id_usuario = ? AND es_sistema = 0`,
      [id_categoria, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obtenerPorUsuario,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};
