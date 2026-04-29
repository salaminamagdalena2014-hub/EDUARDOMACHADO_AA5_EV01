-- ============================================================
-- ESQUEMA DE BASE DE DATOS - EO APP
-- ============================================================
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS eo_app_db 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eo_app_db;

-- ============================================================
-- TABLA: USUARIO
-- ============================================================
CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo VARCHAR(255) UNIQUE NOT NULL,
  cedula VARCHAR(20) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  estado ENUM('activo', 'inactivo') DEFAULT 'activo',
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_correo (correo),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: CATEGORIA
-- ============================================================
CREATE TABLE IF NOT EXISTS categoria (
  id_categoria INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED,
  nombre VARCHAR(100) NOT NULL,
  tipo ENUM('ingreso', 'gasto') NOT NULL,
  color VARCHAR(7) DEFAULT '#000000',
  icono VARCHAR(50),
  es_sistema TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  INDEX idx_usuario (id_usuario),
  INDEX idx_tipo (tipo),
  INDEX idx_es_sistema (es_sistema)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: TRANSACCION
-- ============================================================
CREATE TABLE IF NOT EXISTS transaccion (
  id_transaccion INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  id_categoria INT UNSIGNED NOT NULL,
  descripcion VARCHAR(255),
  monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
  tipo ENUM('ingreso', 'gasto') NOT NULL,
  fecha DATE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) ON DELETE RESTRICT,
  INDEX idx_usuario (id_usuario),
  INDEX idx_categoria (id_categoria),
  INDEX idx_fecha (fecha),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: META_AHORRO
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_ahorro (
  id_meta INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  id_usuario INT UNSIGNED NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  monto_objetivo DECIMAL(10, 2) NOT NULL CHECK (monto_objetivo > 0),
  monto_actual DECIMAL(10, 2) DEFAULT 0.00,
  porcentaje_progreso DECIMAL(5, 2) DEFAULT 0.00,
  fecha_inicio DATE NOT NULL,
  fecha_limite DATE,
  estado ENUM('en_progreso', 'completada', 'cancelada') DEFAULT 'en_progreso',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  INDEX idx_usuario (id_usuario),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLA: META_TRANSACCION (Tabla Pivote N:M)
-- ============================================================
CREATE TABLE IF NOT EXISTS meta_transaccion (
  id_meta INT UNSIGNED NOT NULL,
  id_transaccion INT UNSIGNED NOT NULL,
  monto_asignado DECIMAL(10, 2),
  fecha_asociacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_meta, id_transaccion),
  FOREIGN KEY (id_meta) REFERENCES meta_ahorro(id_meta) ON DELETE CASCADE,
  FOREIGN KEY (id_transaccion) REFERENCES transaccion(id_transaccion) ON DELETE CASCADE,
  INDEX idx_transaccion (id_transaccion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- VISTA: RESUMEN MENSUAL
-- ============================================================
CREATE OR REPLACE VIEW v_resumen_mensual AS
SELECT 
  u.id_usuario,
  u.nombre,
  u.apellido,
  YEAR(t.fecha) AS año,
  MONTH(t.fecha) AS mes,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE 0 END) AS total_ingresos,
  SUM(CASE WHEN t.tipo = 'gasto' THEN t.monto ELSE 0 END) AS total_gastos,
  SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END) AS balance_neto
FROM usuario u
LEFT JOIN transaccion t ON u.id_usuario = t.id_usuario
GROUP BY u.id_usuario, YEAR(t.fecha), MONTH(t.fecha)
ORDER BY u.id_usuario, año DESC, mes DESC;

-- ============================================================
-- VISTA: GASTOS POR CATEGORÍA
-- ============================================================
CREATE OR REPLACE VIEW v_gastos_por_categoria AS
SELECT 
  u.id_usuario,
  u.nombre,
  u.apellido,
  c.id_categoria,
  c.nombre AS categoria,
  c.color,
  c.icono,
  SUM(t.monto) AS total_gastos,
  COUNT(t.id_transaccion) AS cantidad_transacciones
FROM usuario u
LEFT JOIN transaccion t ON u.id_usuario = t.id_usuario AND t.tipo = 'gasto'
LEFT JOIN categoria c ON t.id_categoria = c.id_categoria
WHERE c.id_categoria IS NOT NULL
GROUP BY u.id_usuario, c.id_categoria
ORDER BY u.id_usuario, total_gastos DESC;

-- ============================================================
-- VISTA: PROGRESO DE METAS
-- ============================================================
CREATE OR REPLACE VIEW v_progreso_metas AS
SELECT 
  m.id_meta,
  m.id_usuario,
  m.nombre,
  m.descripcion,
  m.monto_objetivo,
  m.monto_actual,
  m.porcentaje_progreso,
  m.fecha_inicio,
  m.fecha_limite,
  m.estado,
  DATEDIFF(COALESCE(m.fecha_limite, CURDATE()), CURDATE()) AS dias_restantes
FROM meta_ahorro m
ORDER BY m.id_usuario, m.fecha_creacion DESC;

-- ============================================================
-- VISTA: TRANSACCIONES DETALLE
-- ============================================================
CREATE OR REPLACE VIEW v_transacciones_detalle AS
SELECT 
  t.id_transaccion,
  t.id_usuario,
  u.nombre,
  u.apellido,
  u.correo,
  t.id_categoria,
  c.nombre AS categoria,
  c.color,
  c.icono,
  t.descripcion,
  t.monto,
  t.tipo,
  t.fecha,
  t.fecha_creacion
FROM transaccion t
INNER JOIN usuario u ON t.id_usuario = u.id_usuario
INNER JOIN categoria c ON t.id_categoria = c.id_categoria
ORDER BY t.fecha DESC, t.fecha_creacion DESC;

-- ============================================================
-- INSERTAR CATEGORÍAS DEL SISTEMA
-- ============================================================
INSERT INTO categoria (nombre, tipo, color, icono, es_sistema) VALUES
('Salario', 'ingreso', '#10b981', 'briefcase', 1),
('Bonificación', 'ingreso', '#3b82f6', 'gift', 1),
('Intereses', 'ingreso', '#8b5cf6', 'percent', 1),
('Otros Ingresos', 'ingreso', '#06b6d4', 'plus', 1),
('Alimentación', 'gasto', '#f59e0b', 'shopping-cart', 1),
('Transporte', 'gasto', '#ef4444', 'truck', 1),
('Servicios', 'gasto', '#14b8a6', 'home', 1),
('Entretenimiento', 'gasto', '#ec4899', 'music', 1),
('Salud', 'gasto', '#06b6d4', 'heart', 1),
('Educación', 'gasto', '#3b82f6', 'book', 1),
('Otros Gastos', 'gasto', '#6b7280', 'ellipsis', 1);

-- ============================================================
-- CREACIÓN DE ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- ============================================================
ALTER TABLE usuario ADD FULLTEXT INDEX ft_nombre_apellido (nombre, apellido);
ALTER TABLE meta_ahorro ADD INDEX idx_fecha_limite (fecha_limite);
ALTER TABLE transaccion ADD INDEX idx_fecha_usuario (fecha, id_usuario);
