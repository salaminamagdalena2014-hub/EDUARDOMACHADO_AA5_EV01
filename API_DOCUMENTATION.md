# 🚀 EO APP API - Gestión Financiera Personal

Documentación completa para la API RESTful de **EO App**, una solución integral para gestión de finanzas personales.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Autenticación](#autenticación)
5. [Endpoints](#endpoints)
6. [Ejemplos de Uso](#ejemplos-de-uso)
7. [Códigos de Error](#códigos-de-error)

---

## 📦 Requisitos Previos

- **Node.js** v14 o superior
- **MySQL** v8.0 o superior
- **npm** o **yarn** para gestión de dependencias
- Herramienta como **Postman**, **Thunder Client** o **cURL** para probar la API

---

## 🔧 Instalación y Configuración

### 1. Clonar o descargar el repositorio

```bash
cd EDUARDOMACHADO_AA5_EV01
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=eo_app_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_2024
JWT_EXPIRATION=7d

# Servidor
PORT=3000
NODE_ENV=development
```

### 4. Crear la base de datos

Ejecutar el script SQL en MySQL:

```sql
-- Desde MySQL Workbench o la línea de comandos
mysql -u root -p < src/database/schema.sql
```

O copiar el contenido de `src/database/schema.sql` y ejecutarlo en MySQL Workbench.

### 5. Iniciar el servidor

**Modo desarrollo (con recarga automática):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor iniciará en `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── database.js              # Configuración de conexión MySQL
├── controllers/
│   ├── authController.js        # Autenticación (register, login, logout)
│   ├── usuariosController.js    # Gestión de usuarios
│   ├── categoriasController.js  # Gestión de categorías
│   ├── transaccionesController.js # Gestión de transacciones
│   ├── metasController.js       # Gestión de metas de ahorro
│   └── reportesController.js    # Reportes y análisis
├── models/
│   ├── usuarioModel.js          # Operaciones BD usuarios
│   ├── categoriaModel.js        # Operaciones BD categorías
│   ├── transaccionModel.js      # Operaciones BD transacciones
│   ├── metaModel.js             # Operaciones BD metas
│   └── metaTransaccionModel.js  # Operaciones BD meta-transacción
├── routes/
│   ├── authRoutes.js            # Rutas de autenticación
│   ├── usuariosRoutes.js        # Rutas de usuarios
│   ├── categoriasRoutes.js      # Rutas de categorías
│   ├── transaccionesRoutes.js   # Rutas de transacciones
│   ├── metasRoutes.js           # Rutas de metas
│   └── reportesRoutes.js        # Rutas de reportes
├── middleware/
│   ├── authMiddleware.js        # Verificación de JWT
│   └── errorHandler.js          # Manejo global de errores
├── database/
│   └── schema.sql               # Esquema de base de datos
└── server.js                    # Servidor principal
```

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación.

### Flujo de Autenticación

1. **Registro**: El usuario envía sus datos y recibe un token JWT
2. **Login**: El usuario envía correo y contraseña, recibe un token JWT
3. **Rutas protegidas**: Se requiere enviar el token en el header `Authorization: Bearer <token>`

### Header de Autorización

Todas las rutas protegidas requieren este header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 Endpoints

### 🔑 AUTENTICACIÓN

#### POST `/api/auth/register`
Registrar un nuevo usuario

**Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "cedula": "1234567890",
  "contrasena": "MiPassword123"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### POST `/api/auth/login`
Iniciar sesión

**Body:**
```json
{
  "correo": "juan@example.com",
  "contrasena": "MiPassword123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Sesión iniciada exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### POST `/api/auth/logout`
Cerrar sesión (requiere token)

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente",
  "data": null
}
```

---

### 👤 USUARIOS

#### GET `/api/usuarios/:id`
Obtener perfil del usuario (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id_usuario": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "cedula": "1234567890",
    "estado": "activo",
    "fecha_registro": "2024-04-29T10:30:00Z",
    "fecha_actualizacion": "2024-04-29T10:30:00Z"
  }
}
```

---

#### PUT `/api/usuarios/:id`
Actualizar datos del usuario (requiere token)

**Body:**
```json
{
  "nombre": "Juan Carlos",
  "apellido": "Pérez García",
  "cedula": "1234567890"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": { /* datos del usuario */ }
}
```

---

#### PUT `/api/usuarios/:id/password`
Cambiar contraseña (requiere token)

**Body:**
```json
{
  "contrasena_actual": "MiPassword123",
  "contrasena_nueva": "NuevaPassword456",
  "contrasena_confirmar": "NuevaPassword456"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente",
  "data": null
}
```

---

#### DELETE `/api/usuarios/:id`
Desactivar cuenta (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Cuenta desactivada exitosamente",
  "data": null
}
```

---

### 📂 CATEGORÍAS

#### GET `/api/categorias`
Listar todas las categorías (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id_categoria": 1,
      "id_usuario": null,
      "nombre": "Salario",
      "tipo": "ingreso",
      "color": "#10b981",
      "icono": "briefcase",
      "es_sistema": 1,
      "fecha_creacion": "2024-04-29T10:00:00Z"
    },
    {
      "id_categoria": 12,
      "id_usuario": 1,
      "nombre": "Freela",
      "tipo": "ingreso",
      "color": "#3b82f6",
      "icono": "code",
      "es_sistema": 0,
      "fecha_creacion": "2024-04-29T11:00:00Z"
    }
  ]
}
```

---

#### POST `/api/categorias`
Crear categoría personalizada (requiere token)

**Body:**
```json
{
  "nombre": "Freela",
  "tipo": "ingreso",
  "color": "#3b82f6",
  "icono": "code"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id_categoria": 12,
    "id_usuario": 1,
    "nombre": "Freela",
    "tipo": "ingreso",
    "color": "#3b82f6",
    "icono": "code",
    "es_sistema": 0,
    "fecha_creacion": "2024-04-29T11:00:00Z"
  }
}
```

---

#### PUT `/api/categorias/:id`
Editar categoría personalizada (requiere token)

**Body:**
```json
{
  "nombre": "Trabajo Freelance",
  "tipo": "ingreso",
  "color": "#8b5cf6",
  "icono": "briefcase"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Categoría actualizada exitosamente",
  "data": { /* categoría actualizada */ }
}
```

---

#### DELETE `/api/categorias/:id`
Eliminar categoría personalizada (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente",
  "data": null
}
```

---

### 💳 TRANSACCIONES

#### GET `/api/transacciones`
Listar transacciones (requiere token)

**Query Parameters (opcionales):**
- `tipo`: `ingreso` o `gasto`
- `id_categoria`: ID de la categoría
- `fecha_inicio`: Fecha inicio (YYYY-MM-DD)
- `fecha_fin`: Fecha fin (YYYY-MM-DD)

**Ejemplo:**
```
GET /api/transacciones?tipo=gasto&fecha_inicio=2024-04-01&fecha_fin=2024-04-30
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Transacciones obtenidas exitosamente",
  "data": [
    {
      "id_transaccion": 1,
      "id_usuario": 1,
      "id_categoria": 5,
      "descripcion": "Desayuno en café",
      "monto": 50000.00,
      "tipo": "gasto",
      "fecha": "2024-04-29",
      "fecha_creacion": "2024-04-29T09:30:00Z"
    }
  ]
}
```

---

#### GET `/api/transacciones/:id`
Obtener una transacción (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Transacción obtenida exitosamente",
  "data": {
    "id_transaccion": 1,
    "id_usuario": 1,
    "id_categoria": 5,
    "categoria_nombre": "Alimentación",
    "categoria_tipo": "gasto",
    "color": "#f59e0b",
    "icono": "shopping-cart",
    "descripcion": "Desayuno en café",
    "monto": 50000.00,
    "tipo": "gasto",
    "fecha": "2024-04-29",
    "fecha_creacion": "2024-04-29T09:30:00Z"
  }
}
```

---

#### POST `/api/transacciones`
Crear transacción (requiere token)

**Body:**
```json
{
  "id_categoria": 5,
  "tipo": "gasto",
  "monto": 50000.00,
  "descripcion": "Desayuno en café",
  "fecha": "2024-04-29"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Transacción creada exitosamente",
  "data": { /* transacción creada */ }
}
```

---

#### PUT `/api/transacciones/:id`
Actualizar transacción (requiere token)

**Body:**
```json
{
  "id_categoria": 5,
  "tipo": "gasto",
  "monto": 75000.00,
  "descripcion": "Almuerzo en restaurante",
  "fecha": "2024-04-29"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Transacción actualizada exitosamente",
  "data": { /* transacción actualizada */ }
}
```

---

#### DELETE `/api/transacciones/:id`
Eliminar transacción (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Transacción eliminada exitosamente",
  "data": null
}
```

---

### 🎯 METAS DE AHORRO

#### GET `/api/metas`
Listar metas del usuario (requiere token)

**Query Parameters (opcionales):**
- `estado`: `en_progreso`, `completada` o `cancelada`

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Metas obtenidas exitosamente",
  "data": [
    {
      "id_meta": 1,
      "id_usuario": 1,
      "nombre": "Viaje a Disney",
      "descripcion": "Viaje familiar a Disney World",
      "monto_objetivo": 5000000.00,
      "monto_actual": 2500000.00,
      "porcentaje_progreso": 50.00,
      "fecha_inicio": "2024-01-01",
      "fecha_limite": "2025-12-31",
      "estado": "en_progreso",
      "fecha_creacion": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

#### GET `/api/metas/:id`
Obtener detalle de una meta (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Meta obtenida exitosamente",
  "data": { /* meta completa */ }
}
```

---

#### POST `/api/metas`
Crear meta de ahorro (requiere token)

**Body:**
```json
{
  "nombre": "Viaje a Disney",
  "descripcion": "Viaje familiar a Disney World",
  "monto_objetivo": 5000000.00,
  "fecha_inicio": "2024-01-01",
  "fecha_limite": "2025-12-31"
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Meta creada exitosamente",
  "data": { /* meta creada */ }
}
```

---

#### PUT `/api/metas/:id`
Actualizar meta (requiere token)

**Body:**
```json
{
  "nombre": "Viaje a Disney y Orlando",
  "descripcion": "Viaje familiar a Disney World y Universal Orlando",
  "monto_objetivo": 6500000.00,
  "monto_actual": 2500000.00,
  "fecha_inicio": "2024-01-01",
  "fecha_limite": "2025-12-31"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Meta actualizada exitosamente",
  "data": { /* meta actualizada */ }
}
```

---

#### DELETE `/api/metas/:id`
Cancelar meta (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Meta cancelada exitosamente",
  "data": null
}
```

---

#### POST `/api/metas/:id/transacciones`
Asociar transacción a meta (requiere token)

**Body:**
```json
{
  "id_transaccion": 1,
  "monto_asignado": 500000.00
}
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Transacción asociada exitosamente",
  "data": { /* meta actualizada con nuevo progreso */ }
}
```

---

#### DELETE `/api/metas/:id/transacciones/:id_transaccion`
Desasociar transacción de meta (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Transacción desasociada exitosamente",
  "data": { /* meta actualizada con nuevo progreso */ }
}
```

---

### 📊 REPORTES

#### GET `/api/reportes/resumen-mensual`
Resumen de ingresos, gastos y balance por mes (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Resumen mensual obtenido exitosamente",
  "data": [
    {
      "año": 2024,
      "mes": 4,
      "total_ingresos": 5000000.00,
      "total_gastos": 1500000.00,
      "balance_neto": 3500000.00
    },
    {
      "año": 2024,
      "mes": 3,
      "total_ingresos": 4500000.00,
      "total_gastos": 1200000.00,
      "balance_neto": 3300000.00
    }
  ]
}
```

---

#### GET `/api/reportes/gastos-por-categoria`
Gastos totales por categoría (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Gastos por categoría obtenidos exitosamente",
  "data": [
    {
      "categoria": "Alimentación",
      "color": "#f59e0b",
      "icono": "shopping-cart",
      "total_gastos": 450000.00,
      "cantidad_transacciones": 12
    },
    {
      "categoria": "Transporte",
      "color": "#ef4444",
      "icono": "truck",
      "total_gastos": 300000.00,
      "cantidad_transacciones": 8
    }
  ]
}
```

---

#### GET `/api/reportes/progreso-metas`
Progreso de todas las metas (requiere token)

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Progreso de metas obtenido exitosamente",
  "data": [
    {
      "nombre": "Viaje a Disney",
      "descripcion": "Viaje familiar a Disney World",
      "monto_objetivo": 5000000.00,
      "monto_actual": 2500000.00,
      "porcentaje_progreso": 50.00,
      "fecha_inicio": "2024-01-01",
      "fecha_limite": "2025-12-31",
      "estado": "en_progreso",
      "dias_restantes": 612
    }
  ]
}
```

---

## 💡 Ejemplos de Uso

### Con cURL

**Registrar usuario:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    "cedula": "1234567890",
    "contrasena": "MiPassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "juan@example.com",
    "contrasena": "MiPassword123"
  }'
```

**Crear transacción (requiere token):**
```bash
curl -X POST http://localhost:3000/api/transacciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "id_categoria": 5,
    "tipo": "gasto",
    "monto": 50000.00,
    "descripcion": "Desayuno",
    "fecha": "2024-04-29"
  }'
```

---

### Con Postman

1. **Crear colección**: "EO App API"
2. **Variables de entorno**:
   - `BASE_URL`: `http://localhost:3000`
   - `TOKEN`: Guardará el token automáticamente
3. **Script de Post-test** en login:
   ```javascript
   pm.environment.set("TOKEN", pm.response.json().data.token);
   ```
4. **Header en rutas protegidas**:
   - Key: `Authorization`
   - Value: `Bearer {{TOKEN}}`

---

## ❌ Códigos de Error

| Código | Descripción |
|--------|------------|
| **200** | OK - Solicitud exitosa |
| **201** | Created - Recurso creado exitosamente |
| **400** | Bad Request - Solicitud inválida |
| **401** | Unauthorized - No autorizado / Token inválido |
| **403** | Forbidden - Acceso prohibido |
| **404** | Not Found - Recurso no encontrado |
| **409** | Conflict - Conflicto (ej: email duplicado) |
| **500** | Internal Server Error - Error en el servidor |

### Ejemplo de error:
```json
{
  "success": false,
  "message": "El correo ya está registrado",
  "data": null
}
```

---

## 🔒 Reglas de Negocio

1. ✅ Un usuario solo puede ver/modificar sus propios datos
2. ✅ Las categorías del sistema no pueden editarse/eliminarse
3. ✅ El monto debe ser mayor a 0
4. ✅ Al asociar transacciones a metas, se recalcula el progreso automáticamente
5. ✅ Si progreso ≥ 100%, la meta cambia a "completada"
6. ✅ Contraseñas nunca se devuelven en respuestas
7. ✅ Todas las rutas protegidas requieren JWT válido

---

## 📞 Soporte

Para reportar errores o sugerencias, contactar al equipo de desarrollo.

**Última actualización:** 29 de abril de 2024
**Versión API:** 1.0.0
