/**
 * ============================================================
 * MODELO DE TRANSACCIONES
 * Archivo: src/models/transaccionModel.js
 * ============================================================
 * Descripción: Maneja todas las operaciones CRUD de transacciones
 * ============================================================
 */

const pool = require('../config/database');

/**
 * Obtener transacciones del usuario con filtros
 */
const obtenerPorUsuario = async (id_usuario, filtros = {}) => {
  let query = 'SELECT * FROM transaccion WHERE id_usuario = ?';
  const params = [id_usuario];

  if (filtros.tipo) {
    query += ' AND tipo = ?';
    params.push(filtros.tipo);
  }

  if (filtros.id_categoria) {
    query += ' AND id_categoria = ?';
    params.push(filtros.id_categoria);
  }

  if (filtros.fecha_inicio) {
    query += ' AND fecha >= ?';
    params.push(filtros.fecha_inicio);
  }

  if (filtros.fecha_fin) {
    query += ' AND fecha <= ?';
    params.push(filtros.fecha_fin);
  }

  query += ' ORDER BY fecha DESC, fecha_creacion DESC';

  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una transacción por ID
 */
const obtenerPorId = async (id_transaccion, id_usuario) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM transaccion WHERE id_transaccion = ? AND id_usuario = ?',
      [id_transaccion, id_usuario]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva transacción
 */
const crear = async (id_usuario, id_categoria, tipo, monto, descripcion, fecha) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO transaccion (id_usuario, id_categoria, tipo, monto, descripcion, fecha) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, id_categoria, tipo, monto, descripcion, fecha]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una transacción
 */
const actualizar = async (id_transaccion, id_usuario, id_categoria, tipo, monto, descripcion, fecha) => {
  try {
    const [result] = await pool.query(
      `UPDATE transaccion 
       SET id_categoria = ?, tipo = ?, monto = ?, descripcion = ?, fecha = ? 
       WHERE id_transaccion = ? AND id_usuario = ?`,
      [id_categoria, tipo, monto, descripcion, fecha, id_transaccion, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar una transacción
 */
const eliminar = async (id_transaccion, id_usuario) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM transaccion WHERE id_transaccion = ? AND id_usuario = ?',
      [id_transaccion, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener transacción con detalles
 */
const obtenerConDetalles = async (id_transaccion, id_usuario) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.*, c.nombre AS categoria_nombre, c.tipo AS categoria_tipo, c.color, c.icono
       FROM transaccion t
       INNER JOIN categoria c ON t.id_categoria = c.id_categoria
       WHERE t.id_transaccion = ? AND t.id_usuario = ?`,
      [id_transaccion, id_usuario]
    );
    return rows[0] || null;
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
  obtenerConDetalles,
};
