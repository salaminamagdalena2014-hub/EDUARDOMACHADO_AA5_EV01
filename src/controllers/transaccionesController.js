/**
 * ============================================================
 * CONTROLADOR DE TRANSACCIONES
 * Archivo: src/controllers/transaccionesController.js
 * ============================================================
 * Descripción: Maneja operaciones CRUD de transacciones
 * ============================================================
 */

const transaccionModel = require('../models/transaccionModel');
const categoriaModel = require('../models/categoriaModel');
const metaModel = require('../models/metaModel');

/**
 * GET /api/transacciones
 * Listar transacciones del usuario con filtros opcionales
 */
const listar = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;
    const { tipo, id_categoria, fecha_inicio, fecha_fin } = req.query;

    const filtros = {};
    if (tipo) filtros.tipo = tipo;
    if (id_categoria) filtros.id_categoria = id_categoria;
    if (fecha_inicio) filtros.fecha_inicio = fecha_inicio;
    if (fecha_fin) filtros.fecha_fin = fecha_fin;

    const transacciones = await transaccionModel.obtenerPorUsuario(id_usuario, filtros);

    res.json({
      success: true,
      message: 'Transacciones obtenidas exitosamente',
      data: transacciones,
    });
  } catch (error) {
    console.error('Error al listar transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar transacciones',
      data: null,
    });
  }
};

/**
 * GET /api/transacciones/:id
 * Obtener una transacción
 */
const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;

    const transaccion = await transaccionModel.obtenerConDetalles(id, id_usuario);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Transacción obtenida exitosamente',
      data: transaccion,
    });
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacción',
      data: null,
    });
  }
};

/**
 * POST /api/transacciones
 * Crear transacción
 */
const crear = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;
    const { id_categoria, tipo, monto, descripcion, fecha } = req.body;

    // Validar campos
    if (!id_categoria || !tipo || !monto || !fecha) {
      return res.status(400).json({
        success: false,
        message: 'Categoría, tipo, monto y fecha son obligatorios',
        data: null,
      });
    }

    // Validar tipo
    if (!['ingreso', 'gasto'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "gasto"',
        data: null,
      });
    }

    // Validar monto
    if (parseFloat(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0',
        data: null,
      });
    }

    // Verificar que la categoría existe y pertenece al usuario
    const categoria = await categoriaModel.obtenerPorId(id_categoria, id_usuario);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    // Crear transacción
    const id_transaccion = await transaccionModel.crear(
      id_usuario,
      id_categoria,
      tipo,
      monto,
      descripcion || null,
      fecha
    );

    const transaccion = await transaccionModel.obtenerConDetalles(id_transaccion, id_usuario);

    res.status(201).json({
      success: true,
      message: 'Transacción creada exitosamente',
      data: transaccion,
    });
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear transacción',
      data: null,
    });
  }
};

/**
 * PUT /api/transacciones/:id
 * Actualizar transacción
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;
    const { id_categoria, tipo, monto, descripcion, fecha } = req.body;

    // Validar campos
    if (!id_categoria || !tipo || !monto || !fecha) {
      return res.status(400).json({
        success: false,
        message: 'Categoría, tipo, monto y fecha son obligatorios',
        data: null,
      });
    }

    // Validar tipo
    if (!['ingreso', 'gasto'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "gasto"',
        data: null,
      });
    }

    // Validar monto
    if (parseFloat(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto debe ser mayor a 0',
        data: null,
      });
    }

    // Verificar que la transacción existe
    const transaccion = await transaccionModel.obtenerPorId(id, id_usuario);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    // Verificar que la categoría existe y pertenece al usuario
    const categoria = await categoriaModel.obtenerPorId(id_categoria, id_usuario);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    // Actualizar transacción
    const actualizado = await transaccionModel.actualizar(
      id,
      id_usuario,
      id_categoria,
      tipo,
      monto,
      descripcion || null,
      fecha
    );

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    const transaccionActualizada = await transaccionModel.obtenerConDetalles(id, id_usuario);

    res.json({
      success: true,
      message: 'Transacción actualizada exitosamente',
      data: transaccionActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar transacción',
      data: null,
    });
  }
};

/**
 * DELETE /api/transacciones/:id
 * Eliminar transacción
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;

    // Verificar que la transacción existe
    const transaccion = await transaccionModel.obtenerPorId(id, id_usuario);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    // Eliminar transacción
    const eliminado = await transaccionModel.eliminar(id, id_usuario);
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Transacción eliminada exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error al eliminar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar transacción',
      data: null,
    });
  }
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
};
