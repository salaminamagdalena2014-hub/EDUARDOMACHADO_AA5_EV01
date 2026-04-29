/**
 * ============================================================
 * MODELO DE METAS DE AHORRO
 * Archivo: src/models/metaModel.js
 * ============================================================
 * Descripción: Maneja todas las operaciones CRUD de metas
 * ============================================================
 */

const pool = require('../config/database');

/**
 * Obtener metas del usuario con filtro opcional de estado
 */
const obtenerPorUsuario = async (id_usuario, estado = null) => {
  let query = 'SELECT * FROM meta_ahorro WHERE id_usuario = ?';
  const params = [id_usuario];

  if (estado) {
    query += ' AND estado = ?';
    params.push(estado);
  }

  query += ' ORDER BY fecha_creacion DESC';

  try {
    const [rows] = await pool.query(query, params);
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener una meta por ID
 */
const obtenerPorId = async (id_meta, id_usuario) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM meta_ahorro WHERE id_meta = ? AND id_usuario = ?',
      [id_meta, id_usuario]
    );
    return rows[0] || null;
  } catch (error) {
    throw error;
  }
};

/**
 * Crear una nueva meta de ahorro
 */
const crear = async (id_usuario, nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO meta_ahorro (id_usuario, nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_usuario, nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite]
    );
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar una meta
 */
const actualizar = async (id_meta, id_usuario, nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite) => {
  try {
    const [result] = await pool.query(
      `UPDATE meta_ahorro 
       SET nombre = ?, descripcion = ?, monto_objetivo = ?, fecha_inicio = ?, fecha_limite = ? 
       WHERE id_meta = ? AND id_usuario = ?`,
      [nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite, id_meta, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar monto actual y porcentaje de progreso
 */
const actualizarProgreso = async (id_meta, id_usuario, monto_actual) => {
  try {
    // Obtener la meta para calcular porcentaje
    const [meta] = await pool.query(
      'SELECT monto_objetivo FROM meta_ahorro WHERE id_meta = ? AND id_usuario = ?',
      [id_meta, id_usuario]
    );

    if (!meta[0]) return false;

    const porcentaje = Math.min((monto_actual / meta[0].monto_objetivo) * 100, 100).toFixed(2);
    const estado = porcentaje >= 100 ? 'completada' : 'en_progreso';

    const [result] = await pool.query(
      `UPDATE meta_ahorro 
       SET monto_actual = ?, porcentaje_progreso = ?, estado = ? 
       WHERE id_meta = ? AND id_usuario = ?`,
      [monto_actual, porcentaje, estado, id_meta, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancelar una meta (cambiar estado a cancelada)
 */
const cancelar = async (id_meta, id_usuario) => {
  try {
    const [result] = await pool.query(
      'UPDATE meta_ahorro SET estado = "cancelada" WHERE id_meta = ? AND id_usuario = ?',
      [id_meta, id_usuario]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener monto total asignado a una meta
 */
const obtenerMontoAsignado = async (id_meta) => {
  try {
    const [rows] = await pool.query(
      'SELECT COALESCE(SUM(monto_asignado), 0) as total FROM meta_transaccion WHERE id_meta = ?',
      [id_meta]
    );
    return rows[0].total;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obtenerPorUsuario,
  obtenerPorId,
  crear,
  actualizar,
  actualizarProgreso,
  cancelar,
  obtenerMontoAsignado,
};
