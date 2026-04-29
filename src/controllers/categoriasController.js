/**
 * ============================================================
 * CONTROLADOR DE CATEGORÍAS
 * Archivo: src/controllers/categoriasController.js
 * ============================================================
 * Descripción: Maneja operaciones CRUD de categorías
 * ============================================================
 */

const categoriaModel = require('../models/categoriaModel');

/**
 * GET /api/categorias
 * Listar categorías del sistema + personalizadas del usuario
 */
const listar = async (req, res, next) => {
  try {
    const { id_usuario } = req.usuario;

    const categorias = await categoriaModel.obtenerPorUsuario(id_usuario);

    res.json({
      success: true,
      message: 'Categorías obtenidas exitosamente',
      data: categorias,
    });
  } catch (error) {
    console.error('Error al listar categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al listar categorías',
      data: null,
    });
  }
};

/**
 * POST /api/categorias
 * Crear categoría personalizada
 */
const crear = async (req, res, next) => {
  try {
    const { nombre, tipo, color, icono } = req.body;
    const { id_usuario } = req.usuario;

    // Validar campos
    if (!nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y tipo son obligatorios',
        data: null,
      });
    }

    if (!['ingreso', 'gasto'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "gasto"',
        data: null,
      });
    }

    // Validar color si se proporciona
    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({
        success: false,
        message: 'Color debe ser en formato hexadecimal (#RRGGBB)',
        data: null,
      });
    }

    // Crear categoría
    const id_categoria = await categoriaModel.crear(
      id_usuario,
      nombre,
      tipo,
      color || '#000000',
      icono || null
    );

    const categoria = await categoriaModel.obtenerPorId(id_categoria, id_usuario);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria,
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      data: null,
    });
  }
};

/**
 * PUT /api/categorias/:id
 * Editar categoría personalizada
 */
const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, color, icono } = req.body;
    const { id_usuario } = req.usuario;

    // Validar campos
    if (!nombre || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y tipo son obligatorios',
        data: null,
      });
    }

    if (!['ingreso', 'gasto'].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo debe ser "ingreso" o "gasto"',
        data: null,
      });
    }

    // Verificar que la categoría pertenece al usuario y no es del sistema
    const categoria = await categoriaModel.obtenerPorId(id, id_usuario);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    if (categoria.es_sistema) {
      return res.status(403).json({
        success: false,
        message: 'No puedes editar categorías del sistema',
        data: null,
      });
    }

    // Actualizar categoría
    const actualizado = await categoriaModel.actualizar(
      id,
      id_usuario,
      nombre,
      tipo,
      color || '#000000',
      icono || null
    );

    if (!actualizado) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    const categoriaActualizada = await categoriaModel.obtenerPorId(id, id_usuario);

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoriaActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría',
      data: null,
    });
  }
};

/**
 * DELETE /api/categorias/:id
 * Eliminar categoría personalizada
 */
const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.usuario;

    // Verificar que la categoría existe y pertenece al usuario
    const categoria = await categoriaModel.obtenerPorId(id, id_usuario);
    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    // No permitir eliminar categorías del sistema
    if (categoria.es_sistema) {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar categorías del sistema',
        data: null,
      });
    }

    // Eliminar categoría
    const eliminado = await categoriaModel.eliminar(id, id_usuario);
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada',
        data: null,
      });
    }

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: null,
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      data: null,
    });
  }
};

module.exports = {
  listar,
  crear,
  actualizar,
  eliminar,
};
