/**
 * ============================================================
 * CONFIGURACIÓN DE BASE DE DATOS
 * Archivo: src/config/database.js
 * ============================================================
 * Descripción: Configura la conexión a MySQL
 * ============================================================
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear un pool de conexiones para mejor rendimiento
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eo_app_db',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

// Probar la conexión
pool.getConnection().then((connection) => {
  console.log('✅ Conexión a MySQL establecida');
  connection.release();
}).catch((err) => {
  console.error('❌ Error conectando a MySQL:', err.message);
  process.exit(1);
});

module.exports = pool;
