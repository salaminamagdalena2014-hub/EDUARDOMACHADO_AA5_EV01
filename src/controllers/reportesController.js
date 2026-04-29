/**
 * ============================================================
 * CONTROLADOR DE REPORTES
 * Archivo: src/controllers/reportesController.js
 * ============================================================
 * Descripción: Maneja reportes usando las vistas de la BD
 * ============================================================
 */

const pool = require('../config/database');

/**
 * GET /api/reportes/resumen-mensual
 * Resumen de ingresos/gastos/balance del usuario por mes/año
 */
const resumenMensual = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;

    const [filas] = await pool.query(
      `SELECT año, mes, total_ingresos, total_gastos, balance_neto 
       FROM v_resumen_mensual 
       WHERE id_usuario = ? 
       ORDER BY año DESC, mes DESC`,
      [id_usuario]
    );

    res.json({
      success: true,
      message: 'Resumen mensual obtenido exitosamente',
      data: filas,
    });
  } catch (error) {
    console.error('Error al obtener resumen mensual:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener resumen mensual',
      data: null,
    });
  }
};

/**
 * GET /api/reportes/gastos-por-categoria
 * Total de gastos agrupados por categoría
 */
const gastosPorCategoria = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;

    const [filas] = await pool.query(
      `SELECT categoria, color, icono, total_gastos, cantidad_transacciones 
       FROM v_gastos_por_categoria 
       WHERE id_usuario = ? 
       ORDER BY total_gastos DESC`,
      [id_usuario]
    );

    res.json({
      success: true,
      message: 'Gastos por categoría obtenidos exitosamente',
      data: filas,
    });
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener gastos por categoría',
      data: null,
    });
  }
};

/**
 * GET /api/reportes/progreso-metas
 * Estado y progreso de todas las metas del usuario
 */
const progresoMetas = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;

    const [filas] = await pool.query(
      `SELECT nombre, descripcion, monto_objetivo, monto_actual, porcentaje_progreso, 
              fecha_inicio, fecha_limite, estado, dias_restantes 
       FROM v_progreso_metas 
       WHERE id_usuario = ? 
       ORDER BY fecha_creacion DESC`,
      [id_usuario]
    );

    res.json({
      success: true,
      message: 'Progreso de metas obtenido exitosamente',
      data: filas,
    });
  } catch (error) {
    console.error('Error al obtener progreso de metas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener progreso de metas',
      data: null,
    });
  }
};

module.exports = {
  resumenMensual,
  gastosPorCategoria,
  progresoMetas,
};
