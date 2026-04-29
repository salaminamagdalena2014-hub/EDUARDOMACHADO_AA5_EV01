/**
 * ============================================================
 * SERVIDOR PRINCIPAL - EO APP API
 * Archivo: src/server.js
 * ============================================================
 * Descripción: Servidor Express para la API de gestión financiera
 * Tecnologías: Node.js, Express, MySQL, JWT, bcryptjs
 * ============================================================
 */

require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const pool = require('./config/database');

// Middlewares
const errorHandler = require('./middleware/errorHandler');

// Rutas
const authRoutes = require('./routes/authRoutes');
const usuariosRoutes = require('./routes/usuariosRoutes');
const categoriasRoutes = require('./routes/categoriasRoutes');
const transaccionesRoutes = require('./routes/transaccionesRoutes');
const metasRoutes = require('./routes/metasRoutes');
const reportesRoutes = require('./routes/reportesRoutes');

// Inicializar Express
const app = express();

// ─── MIDDLEWARES GLOBALES ────────────────────────────────────────────────────

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos urlencoded
app.use(express.urlencoded({ extended: true }));

// ─── RUTAS PÚBLICAS ──────────────────────────────────────────────────────────

/**
 * Ruta raíz: información de la API
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API RESTful - EO App (Gestión Financiera Personal)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout (requiere token)',
      },
      usuarios: {
        obtener: 'GET /api/usuarios/:id (requiere token)',
        actualizar: 'PUT /api/usuarios/:id (requiere token)',
        cambiarPassword: 'PUT /api/usuarios/:id/password (requiere token)',
        desactivar: 'DELETE /api/usuarios/:id (requiere token)',
      },
      categorias: {
        listar: 'GET /api/categorias (requiere token)',
        crear: 'POST /api/categorias (requiere token)',
        actualizar: 'PUT /api/categorias/:id (requiere token)',
        eliminar: 'DELETE /api/categorias/:id (requiere token)',
      },
      transacciones: {
        listar: 'GET /api/transacciones (requiere token)',
        obtener: 'GET /api/transacciones/:id (requiere token)',
        crear: 'POST /api/transacciones (requiere token)',
        actualizar: 'PUT /api/transacciones/:id (requiere token)',
        eliminar: 'DELETE /api/transacciones/:id (requiere token)',
      },
      metas: {
        listar: 'GET /api/metas (requiere token)',
        obtener: 'GET /api/metas/:id (requiere token)',
        crear: 'POST /api/metas (requiere token)',
        actualizar: 'PUT /api/metas/:id (requiere token)',
        cancelar: 'DELETE /api/metas/:id (requiere token)',
        asociarTransaccion: 'POST /api/metas/:id/transacciones (requiere token)',
        desasociarTransaccion: 'DELETE /api/metas/:id/transacciones/:id_transaccion (requiere token)',
      },
      reportes: {
        resumenMensual: 'GET /api/reportes/resumen-mensual (requiere token)',
        gastosPorCategoria: 'GET /api/reportes/gastos-por-categoria (requiere token)',
        progresoMetas: 'GET /api/reportes/progreso-metas (requiere token)',
      },
    },
  });
});

// ─── RUTAS DE LA API ──────────────────────────────────────────────────────────

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/usuarios', usuariosRoutes);

// Rutas de categorías
app.use('/api/categorias', categoriasRoutes);

// Rutas de transacciones
app.use('/api/transacciones', transaccionesRoutes);

// Rutas de metas
app.use('/api/metas', metasRoutes);

// Rutas de reportes
app.use('/api/reportes', reportesRoutes);

// ─── MANEJO DE RUTAS NO ENCONTRADAS ──────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    data: null,
  });
});

// ─── MIDDLEWARE GLOBAL DE MANEJO DE ERRORES ──────────────────────────────────

app.use(errorHandler);

// ─── INICIO DEL SERVIDOR ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════════════════════╗
║                                                         ║
║          🚀 EO APP API - SERVIDOR INICIADO 🚀          ║
║                                                         ║
║  URL:     http://localhost:${PORT}                        ║
║  Entorno: ${process.env.NODE_ENV || 'development'}                   ║
║  Base de datos: ${process.env.DB_NAME || 'eo_app_db'}                ║
║                                                         ║
║  ✅ Listo para recibir solicitudes...                  ║
║                                                         ║
╚═════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
