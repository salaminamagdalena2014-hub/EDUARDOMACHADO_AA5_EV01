/**
 * ============================================================
 * MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
 * Archivo: src/middleware/errorHandler.js
 * ============================================================
 * Descripción: Captura y formatea todos los errores de la API
 * ============================================================
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Errores de validación
  if (err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Solicitud inválida',
      data: null,
    });
  }

  // Errores de autenticación
  if (err.statusCode === 401) {
    return res.status(401).json({
      success: false,
      message: err.message || 'No autorizado',
      data: null,
    });
  }

  // Errores de permiso
  if (err.statusCode === 403) {
    return res.status(403).json({
      success: false,
      message: err.message || 'Acceso prohibido',
      data: null,
    });
  }

  // Errores no encontrados
  if (err.statusCode === 404) {
    return res.status(404).json({
      success: false,
      message: err.message || 'Recurso no encontrado',
      data: null,
    });
  }

  // Conflictos (duplicados, etc)
  if (err.statusCode === 409) {
    return res.status(409).json({
      success: false,
      message: err.message || 'Conflicto en la solicitud',
      data: null,
    });
  }

  // Error genérico del servidor
  return res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    data: null,
  });
};

module.exports = errorHandler;
