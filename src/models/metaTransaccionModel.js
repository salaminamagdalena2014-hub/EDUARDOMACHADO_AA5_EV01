/**
 * ============================================================
 * MODELO DE META-TRANSACCIÓN
 * Archivo: src/models/metaTransaccionModel.js
 * ============================================================
 * Descripción: Maneja la relación N:M entre metas y transacciones
 * ============================================================
 */

const pool = require('../config/database');

/**
 * Asociar una transacción a una meta
 */
const asociar = async (id_meta, id_transaccion, monto_asignado = null) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO meta_transaccion (id_meta, id_transaccion, monto_asignado) 
       VALUES (?, ?, ?)`,
      [id_meta, id_transaccion, monto_asignado]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Desasociar una transacción de una meta
 */
const desasociar = async (id_meta, id_transaccion) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM meta_transaccion WHERE id_meta = ? AND id_transaccion = ?',
      [id_meta, id_transaccion]
    );
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener transacciones asociadas a una meta
 */
const obtenerTransaccionesDeMeta = async (id_meta) => {
  try {
    const [rows] = await pool.query(
      `SELECT mt.*, t.* FROM meta_transaccion mt
       INNER JOIN transaccion t ON mt.id_transaccion = t.id_transaccion
       WHERE mt.id_meta = ?`,
      [id_meta]
    );
    return rows;
  } catch (error) {
    throw error;
  }
};

/**
 * Verificar si una transacción ya está asociada a una meta
 */
const estaAsociada = async (id_meta, id_transaccion) => {
  try {
    const [rows] = await pool.query(
      'SELECT 1 FROM meta_transaccion WHERE id_meta = ? AND id_transaccion = ?',
      [id_meta, id_transaccion]
    );
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  asociar,
  desasociar,
  obtenerTransaccionesDeMeta,
  estaAsociada,
};
