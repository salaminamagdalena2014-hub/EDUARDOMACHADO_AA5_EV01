/**
 * ============================================================
 * SERVICIO WEB - REGISTRO E INICIO DE SESIÓN (AUTH API)
 * Evidencia GA7-220501096-AA5-EV01
 * ============================================================
 * Descripción: API REST para registro y autenticación de usuarios.
 * Tecnologías: Node.js, Express, bcryptjs, JWT
 * ============================================================
 */

// Importación de módulos necesarios
const express = require('express');       // Framework web para Node.js
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación

// Inicialización de la aplicación Express
const app = express();

// ─── MIDDLEWARES GLOBALES ────────────────────────────────────────────────────

// Permite que la API reciba y procese cuerpos de solicitud en formato JSON
app.use(express.json());

// ─── RUTAS ───────────────────────────────────────────────────────────────────

// Todas las rutas de autenticación tendrán el prefijo /api/auth
app.use('/api/auth', authRoutes);

// Ruta raíz: verifica que el servidor está en línea
app.get('/', (req, res) => {
  res.json({
    mensaje: 'Servicio Web de Autenticación activo',
    version: '1.0.0',
    endpoints: {
      registro: 'POST /api/auth/registro',
      login: 'POST /api/auth/login',
    },
  });
});

// ─── MANEJO DE RUTAS NO ENCONTRADAS ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── INICIO DEL SERVIDOR ─────────────────────────────────────────────────────

// Puerto en el que escuchará el servidor (variable de entorno o 3000 por defecto)
const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PUERTO}`);
});

module.exports = app; // Exportamos para pruebas o uso externo
