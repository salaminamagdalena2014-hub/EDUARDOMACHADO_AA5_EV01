/**
 * ============================================================
 * MIDDLEWARE DE AUTENTICACIÓN JWT
 * Archivo: src/middleware/authMiddleware.js
 * ============================================================
 * Descripción: Verifica y valida tokens JWT en rutas protegidas
 * ============================================================
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar JWT
 * Requiere: Authorization: Bearer <token>
 */
const verificarToken = (req, res, next) => {
  try {
    // Obtener el header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token de autenticación',
      });
    }

    // Extraer el token (formato: Bearer <token>)
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido',
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_2024');

    // Adjuntar el usuario decodificado a la solicitud
    req.usuario = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }
};

module.exports = {
  verificarToken,
};
