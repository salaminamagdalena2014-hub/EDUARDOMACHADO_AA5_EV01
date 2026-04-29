/**
 * ============================================================
 * CONTROLADOR DE METAS DE AHORRO
 * Archivo: src/controllers/metasController.js
 * ============================================================
 * Descripción: Maneja operaciones CRUD de metas de ahorro
 * ============================================================
 */

const metaModel = require('../models/metaModel');
const metaTransaccionModel = require('../models/metaTransaccionModel');
const transaccionModel = require('../models/transaccionModel');

/**
 * GET /api/metas
 * Listar metas del usuario (con filtro opcional de estado)
 */
const listar = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;
    const { estado } = req.query;

    const metas = await metaModel.obtenerPorUsuario(
      id_usuario,
      estado || null
    );

    res.json({
      success: true,
      message: 'Metas obtenidas exitosamente',
      data: metas,
    });
  } catch (error) {
    console.error('Error al listar metas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar metas',
      data: null,
    });
  }
};

/**
 * GET /api/metas/:id
 * Obtener detalle de una meta
 */
const obtener = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;

    const meta = await metaModel.obtenerPorId(id, id_usuario);
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Meta obtenida exitosamente',
      data: meta,
    });
  } catch (error) {
    console.error('Error al obtener meta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener meta',
      data: null,
    });
  }
};

/**
 * POST /api/metas
 * Crear meta de ahorro
 */
const crear = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;
    const { nombre, descripcion, monto_objetivo, fecha_inicio, fecha_limite } = req.body;

    // Validar campos obligatorios
    if (!nombre || !monto_objetivo || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, monto objetivo y fecha inicio son obligatorios',
        data: null,
      });
    }

    // Validar monto
    if (parseFloat(monto_objetivo) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto objetivo debe ser mayor a 0',
        data: null,
      });
    }

    // Crear meta
    const id_meta = await metaModel.crear(
      id_usuario,
      nombre,
      descripcion || null,
      monto_objetivo,
      fecha_inicio,
      fecha_limite || null
    );

    const meta = await metaModel.obtenerPorId(id_meta, id_usuario);

    res.status(201).json({
      success: true,
      message: 'Meta creada exitosamente',
      data: meta,
    });
  } catch (error) {
    console.error('Error al crear meta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear meta',
      data: null,
    });
  }
};

/**
 * PUT /api/metas/:id
 * Actualizar meta (incluyendo monto_actual y porcentaje_progreso)
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;
    const { nombre, descripcion, monto_objetivo, monto_actual, fecha_inicio, fecha_limite } = req.body;

    // Validar campos
    if (!nombre || !monto_objetivo || !fecha_inicio) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, monto objetivo y fecha inicio son obligatorios',
        data: null,
      });
    }

    // Validar monto
    if (parseFloat(monto_objetivo) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El monto objetivo debe ser mayor a 0',
        data: null,
      });
    }

    // Verificar que la meta existe
    const meta = await metaModel.obtenerPorId(id, id_usuario);
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    // Actualizar meta
    const actualizado = await metaModel.actualizar(
      id,
      id_usuario,
      nombre,
      descripcion || null,
      monto_objetivo,
      fecha_inicio,
      fecha_limite || null
    );

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    // Si se proporciona monto_actual, actualizar progreso
    if (monto_actual !== undefined) {
      await metaModel.actualizarProgreso(id, id_usuario, monto_actual);
    }

    const metaActualizada = await metaModel.obtenerPorId(id, id_usuario);

    res.json({
      success: true,
      message: 'Meta actualizada exitosamente',
      data: metaActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar meta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar meta',
      data: null,
    });
  }
};

/**
 * DELETE /api/metas/:id
 * Cancelar meta (cambiar estado a 'cancelada')
 */
const cancelar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;

    // Verificar que la meta existe
    const meta = await metaModel.obtenerPorId(id, id_usuario);
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    // Cancelar meta
    const cancelada = await metaModel.cancelar(id, id_usuario);
    if (!cancelada) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Meta cancelada exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error al cancelar meta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cancelar meta',
      data: null,
    });
  }
};

/**
 * POST /api/metas/:id/transacciones
 * Asociar una transacción a una meta
 */
const asociarTransaccion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_transaccion, monto_asignado } = req.body;
    const { id_usuario } = req.usuario;

    // Validar campos
    if (!id_transaccion) {
      return res.status(400).json({
        success: false,
        message: 'ID de transacción es obligatorio',
        data: null,
      });
    }

    // Verificar que la meta existe
    const meta = await metaModel.obtenerPorId(id, id_usuario);
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    // Verificar que la transacción existe y pertenece al usuario
    const transaccion = await transaccionModel.obtenerPorId(id_transaccion, id_usuario);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    // Verificar que no esté ya asociada
    const yaAsociada = await metaTransaccionModel.estaAsociada(id, id_transaccion);
    if (yaAsociada) {
      return res.status(409).json({
        success: false,
        message: 'La transacción ya está asociada a esta meta',
        data: null,
      });
    }

    // Asociar transacción
    await metaTransaccionModel.asociar(id, id_transaccion, monto_asignado || transaccion.monto);

    // Recalcular progreso
    const montoAsignado = await metaModel.obtenerMontoAsignado(id);
    await metaModel.actualizarProgreso(id, id_usuario, montoAsignado);

    const metaActualizada = await metaModel.obtenerPorId(id, id_usuario);

    res.status(201).json({
      success: true,
      message: 'Transacción asociada exitosamente',
      data: metaActualizada,
    });
  } catch (error) {
    console.error('Error al asociar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al asociar transacción',
      data: null,
    });
  }
};

/**
 * DELETE /api/metas/:id/transacciones/:id_transaccion
 * Desasociar transacción de meta
 */
const desasociarTransaccion = async (req, res, next) => {
  try {
    const { id, id_transaccion } = req.params;
    const { id_usuario } = req.usuario;

    // Verificar que la meta existe
    const meta = await metaModel.obtenerPorId(id, id_usuario);
    if (!meta) {
      return res.status(404).json({
        success: false,
        message: 'Meta no encontrada',
        data: null,
      });
    }

    // Verificar que la transacción existe y pertenece al usuario
    const transaccion = await transaccionModel.obtenerPorId(id_transaccion, id_usuario);
    if (!transaccion) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada',
        data: null,
      });
    }

    // Desasociar transacción
    await metaTransaccionModel.desasociar(id, id_transaccion);

    // Recalcular progreso
    const montoAsignado = await metaModel.obtenerMontoAsignado(id);
    await metaModel.actualizarProgreso(id, id_usuario, montoAsignado);

    const metaActualizada = await metaModel.obtenerPorId(id, id_usuario);

    res.json({
      success: true,
      message: 'Transacción desasociada exitosamente',
      data: metaActualizada,
    });
  } catch (error) {
    console.error('Error al desasociar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desasociar transacción',
      data: null,
    });
  }
};

module.exports = {
  listar,
  obtener,
  crear,
  actualizar,
  cancelar,
  asociarTransaccion,
  desasociarTransaccion,
};
