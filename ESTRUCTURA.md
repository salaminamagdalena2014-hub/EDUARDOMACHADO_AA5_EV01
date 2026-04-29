# 📁 ESTRUCTURA COMPLETA DEL PROYECTO

## Árbol de Directorios

```
EDUARDOMACHADO_AA5_EV01/
│
├── 📄 package.json                          ← Dependencias y scripts
├── 📄 .env.example                          ← Variables de entorno (template)
├── 📄 .gitignore                            ← Archivos ignorados por Git
│
├── 📄 README.md                             ← Descripción del proyecto
├── 📄 API_DOCUMENTATION.md                  ← Documentación completa de endpoints
├── 📄 GUIA_USO.md                           ← Guía de uso y casos prácticos
├── 📄 PROYECTO_RESUMEN.md                   ← Resumen del proyecto
├── 📄 ESTRUCTURA.md                         ← Este archivo
├── 📄 REPOSITORIO.txt                       ← URL del repositorio
│
├── 📄 install.sh                            ← Script instalación (Linux/Mac)
├── 📄 install.bat                           ← Script instalación (Windows)
├── 📄 EO_App_API.postman_collection.json    ← Colección Postman para testing
│
└── 📁 src/
    │
    ├── 📄 server.js                         ← Servidor principal Express
    │
    ├── 📁 config/
    │   └── database.js                      ← Configuración conexión MySQL
    │
    ├── 📁 middleware/
    │   ├── authMiddleware.js                ← Verificación de JWT
    │   └── errorHandler.js                  ← Manejo global de errores
    │
    ├── 📁 models/
    │   ├── usuarioModel.js                  ← CRUD de usuarios
    │   ├── categoriaModel.js                ← CRUD de categorías
    │   ├── transaccionModel.js              ← CRUD de transacciones
    │   ├── metaModel.js                     ← CRUD de metas
    │   └── metaTransaccionModel.js          ← Relación N:M
    │
    ├── 📁 controllers/
    │   ├── authController.js                ← Login, registro, logout
    │   ├── usuariosController.js            ← Gestión de perfil
    │   ├── categoriasController.js          ← Gestión de categorías
    │   ├── transaccionesController.js       ← Gestión de transacciones
    │   ├── metasController.js               ← Gestión de metas
    │   └── reportesController.js            ← Reportes financieros
    │
    ├── 📁 routes/
    │   ├── authRoutes.js                    ← Rutas /api/auth
    │   ├── usuariosRoutes.js                ← Rutas /api/usuarios
    │   ├── categoriasRoutes.js              ← Rutas /api/categorias
    │   ├── transaccionesRoutes.js           ← Rutas /api/transacciones
    │   ├── metasRoutes.js                   ← Rutas /api/metas
    │   └── reportesRoutes.js                ← Rutas /api/reportes
    │
    ├── 📁 database/
    │   └── schema.sql                       ← Esquema completo de BD
    │
    └── 📁 utils/
        └── helpers.js                       ← Funciones auxiliares
```

---

## 📊 Resumen de Archivos

### Archivos de Configuración
| Archivo | Descripción |
|---------|------------|
| `package.json` | Dependencias, scripts, información del proyecto |
| `.env.example` | Template de variables de entorno |
| `.gitignore` | Archivos ignorados por Git |

### Documentación
| Archivo | Líneas | Descripción |
|---------|--------|------------|
| `README.md` | ~100 | Descripción general del proyecto |
| `API_DOCUMENTATION.md` | ~800 | Documentación completa de todos los endpoints |
| `GUIA_USO.md` | ~400 | Guía práctica de uso de la API |
| `PROYECTO_RESUMEN.md` | ~300 | Resumen del proyecto con checklist |
| `ESTRUCTURA.md` | Este archivo | Estructura del proyecto |

### Scripts
| Archivo | Sistema | Descripción |
|---------|---------|------------|
| `install.sh` | Linux/Mac | Script automático de instalación |
| `install.bat` | Windows | Script automático de instalación |

### Testing
| Archivo | Descripción |
|---------|------------|
| `EO_App_API.postman_collection.json` | Colección con 20+ requests para Postman |
| `Auth API Collection.postman_collection.json` | Colección anterior (referencia) |

---

## 🔧 Servidor Principal

**Archivo:** `src/server.js`

```javascript
// Configura:
// - Middlewares globales (JSON parser)
// - Todas las rutas de la API
// - Manejo de rutas no encontradas
// - Middleware global de errores
// - Puerto (3000 por defecto)
```

---

## 🔑 Middleware

### authMiddleware.js
- `verificarToken()` - Valida JWT en Authorization header

### errorHandler.js
- Captura y formatea todos los errores
- Retorna JSON con estructura estándar

---

## 📦 Modelos (Base de Datos)

### usuarioModel.js
```javascript
obtenerPorCorreo()
obtenerPorId()
crear()
actualizar()
actualizarContrasena()
desactivar()
```

### categoriaModel.js
```javascript
obtenerPorUsuario()
obtenerPorId()
crear()
actualizar()
eliminar()
```

### transaccionModel.js
```javascript
obtenerPorUsuario()
obtenerPorId()
crear()
actualizar()
eliminar()
obtenerConDetalles()
```

### metaModel.js
```javascript
obtenerPorUsuario()
obtenerPorId()
crear()
actualizar()
actualizarProgreso()
cancelar()
obtenerMontoAsignado()
```

### metaTransaccionModel.js
```javascript
asociar()
desasociar()
obtenerTransaccionesDeMeta()
estaAsociada()
```

---

## 🎮 Controladores

### authController.js (180 líneas)
- `register()` - POST /api/auth/register
- `login()` - POST /api/auth/login
- `logout()` - POST /api/auth/logout

### usuariosController.js (250 líneas)
- `obtenerPerfil()` - GET /api/usuarios/:id
- `actualizar()` - PUT /api/usuarios/:id
- `cambiarContrasena()` - PUT /api/usuarios/:id/password
- `desactivar()` - DELETE /api/usuarios/:id

### categoriasController.js (200 líneas)
- `listar()` - GET /api/categorias
- `crear()` - POST /api/categorias
- `actualizar()` - PUT /api/categorias/:id
- `eliminar()` - DELETE /api/categorias/:id

### transaccionesController.js (350 líneas)
- `listar()` - GET /api/transacciones
- `obtener()` - GET /api/transacciones/:id
- `crear()` - POST /api/transacciones
- `actualizar()` - PUT /api/transacciones/:id
- `eliminar()` - DELETE /api/transacciones/:id

### metasController.js (400 líneas)
- `listar()` - GET /api/metas
- `obtener()` - GET /api/metas/:id
- `crear()` - POST /api/metas
- `actualizar()` - PUT /api/metas/:id
- `cancelar()` - DELETE /api/metas/:id
- `asociarTransaccion()` - POST /api/metas/:id/transacciones
- `desasociarTransaccion()` - DELETE /api/metas/:id/transacciones/:id_transaccion

### reportesController.js (100 líneas)
- `resumenMensual()` - GET /api/reportes/resumen-mensual
- `gastosPorCategoria()` - GET /api/reportes/gastos-por-categoria
- `progresoMetas()` - GET /api/reportes/progreso-metas

---

## 🛣️ Rutas

### authRoutes.js
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

### usuariosRoutes.js
```
GET    /api/usuarios/:id
PUT    /api/usuarios/:id
PUT    /api/usuarios/:id/password
DELETE /api/usuarios/:id
```

### categoriasRoutes.js
```
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

### transaccionesRoutes.js
```
GET    /api/transacciones
GET    /api/transacciones/:id
POST   /api/transacciones
PUT    /api/transacciones/:id
DELETE /api/transacciones/:id
```

### metasRoutes.js
```
GET    /api/metas
GET    /api/metas/:id
POST   /api/metas
PUT    /api/metas/:id
DELETE /api/metas/:id
POST   /api/metas/:id/transacciones
DELETE /api/metas/:id/transacciones/:id_transaccion
```

### reportesRoutes.js
```
GET /api/reportes/resumen-mensual
GET /api/reportes/gastos-por-categoria
GET /api/reportes/progreso-metas
```

---

## 🗄️ Base de Datos

### Tablas (6)
1. `usuario` - Usuarios del sistema
2. `categoria` - Categorías de transacciones
3. `transaccion` - Transacciones financieras
4. `meta_ahorro` - Metas de ahorro
5. `meta_transaccion` - Relación N:M
6. (Implícita) Auditoría con TIMESTAMP

### Vistas (4)
1. `v_resumen_mensual` - Ingresos/gastos/balance por mes
2. `v_gastos_por_categoria` - Gastos agrupados
3. `v_progreso_metas` - Progreso de metas
4. `v_transacciones_detalle` - Transacciones con detalles

### Índices
- Índices en foreign keys
- Índices en búsquedas frecuentes
- Full text search en usuario

---

## 📊 Estadísticas del Código

| Métrica | Cantidad |
|---------|----------|
| Archivos | 30+ |
| Líneas de código | 3000+ |
| Endpoints | 26 |
| Controladores | 6 |
| Modelos | 5 |
| Rutas | 6 |
| Middleware | 2 |
| Documentación | 1500+ líneas |

---

## 🔄 Flujos Principales

### 1. Autenticación
```
Request → authMiddleware.verificarToken() → Verifica JWT
         → Si válido: continúa
         → Si inválido: retorna 401
```

### 2. CRUD
```
Request → Route → Controller → Model → Database
                      ↓
                Validaciones
                      ↓
                Lógica de negocio
                      ↓
                Response
```

### 3. Manejo de Errores
```
Error → errorHandler → Formato JSON → Response
            ↓
        Log en consola
```

---

## 📦 Dependencias Externas

```json
{
  "bcryptjs": "Cifrado de contraseñas",
  "dotenv": "Variables de entorno",
  "express": "Framework web",
  "jsonwebtoken": "Autenticación JWT",
  "mysql2": "Driver MySQL",
  "uuid": "Generador de IDs (opcional)"
}
```

---

## 🚀 Punto de Entrada

**Archivo:** `src/server.js`

```javascript
// 1. Carga variables de entorno
require('dotenv').config();

// 2. Conecta a MySQL
const pool = require('./config/database');

// 3. Configura Express
const app = express();

// 4. Registra middlewares y rutas
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
// ... etc

// 5. Inicia servidor
app.listen(PORT, () => { ... })
```

---

## ✅ Verificación de Completitud

- [x] 6 Controladores completamente funcionales
- [x] 5 Modelos con todas las operaciones
- [x] 6 Archivos de rutas
- [x] 26 Endpoints implementados
- [x] Autenticación JWT
- [x] Validaciones de entrada
- [x] Manejo global de errores
- [x] Documentación exhaustiva
- [x] Ejemplos de uso
- [x] Scripts de instalación

---

## 🎯 Uso del Proyecto

### Instalación
```bash
./install.sh      # Linux/Mac
install.bat       # Windows
npm install
```

### Configuración
```bash
cp .env.example .env
# Editar .env con credenciales MySQL
# Ejecutar schema.sql en MySQL
```

### Ejecución
```bash
npm run dev       # Desarrollo
npm start         # Producción
```

### Testing
```bash
# Importar EO_App_API.postman_collection.json en Postman
# O usar cURL/fetch con la documentación
```

---

## 📞 Contacto y Repositorio

**Repositorio GitHub:**  
https://github.com/salaminamagdalena2014-hub/EDUARDOMACHADO_AA5_EV01

**Autor:** Eduardo Machado  
**Evidencia:** GA7-220501096-AA5-EV01  
**Fecha:** 29 de abril de 2024  
**Versión:** 1.0.0  

---

**¡El proyecto está 100% completo y documentado!** 🎉
