# � README - EO APP API

## 🎯 Descripción General

**EO App API** es una solución completa de **gestión financiera personal** construida con **Node.js**, **Express** y **MySQL**. Permite a los usuarios:

- ✅ Registrarse e iniciar sesión de forma segura
- ✅ Gestionar categorías de ingresos y gastos
- ✅ Registrar transacciones detalladas
- ✅ Crear metas de ahorro y monitorear su progreso
- ✅ Acceder a reportes financieros
- ✅ Visualizar análisis de gastos por categoría

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js v14+
- MySQL 8.0+
- npm

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# 3. Crear base de datos
# Ejecutar src/database/schema.sql en MySQL

# 4. Iniciar servidor (desarrollo)
npm run dev

# O (producción)
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 📖 Documentación

Para documentación detallada de todos los endpoints, ver: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

---

## 🏗️ Tecnologías Utilizadas

| Tecnología | Descripción |
|-----------|-----------|
| **Node.js** | Runtime JavaScript |
| **Express** | Framework web |
| **MySQL** | Base de datos relacional |
| **JWT** | Autenticación con tokens |
| **bcryptjs** | Cifrado de contraseñas |

---

## 📂 Estructura de Carpetas

```
src/
├── config/           # Configuración (BD)
├── controllers/      # Lógica de negocio
├── middleware/       # Middlewares (auth, errores)
├── models/           # Consultas a BD
├── routes/           # Definición de endpoints
├── database/         # Esquema SQL
└── server.js         # Servidor principal
```

---

## 🔐 Seguridad

- 🔒 Contraseñas hasheadas con bcryptjs (SALT_ROUNDS: 10)
- 🔑 Autenticación basada en JWT
- 🛡️ Validación de entrada en todos los endpoints
- 👤 Restricción de acceso a datos propios
- ⏰ Tokens con expiración configurable

---

## 🤝 Contribuciones

Este proyecto es parte de la evidencia de aprendizaje GA7-220501096-AA5-EV01 del programa SENA.

---

## 📄 Licencia

ISC

---

## 📞 Contacto

**Repositorio:** https://github.com/salaminamagdalena2014-hub/EDUARDOMACHADO_AA5_EV01

**Autor:** Eduardo Machado

**Fecha:** 29 de abril de 2024

---

## ✅ Características Implementadas

- [x] Autenticación con JWT
- [x] Hashing de contraseñas con bcryptjs
- [x] CRUD completo de usuarios
- [x] CRUD de categorías (sistema + personalizadas)
- [x] CRUD de transacciones
- [x] CRUD de metas de ahorro
- [x] Asociación de transacciones a metas
- [x] Cálculo automático de progreso
- [x] Reportes (resumen mensual, gastos por categoría, progreso metas)
- [x] Validaciones completas
- [x] Manejo global de errores
- [x] Documentación completa

```bash
git clone <URL_DEL_REPOSITORIO>
cd auth-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el servidor

```bash
npm start
```

El servidor quedará disponible en: `http://localhost:3000`

---

## 📡 Endpoints del Servicio Web

### ✅ Verificar estado del servidor
```
GET http://localhost:3000/
```

---

### 👤 Registrar usuario
```
POST http://localhost:3000/api/auth/registro
Content-Type: application/json

{
  "usuario": "juanperez",
  "contrasena": "miClave123"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente.",
  "datos": {
    "id": "uuid-generado",
    "usuario": "juanperez",
    "creadoEn": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error - usuario ya existe (409):**
```json
{
  "exito": false,
  "mensaje": "El nombre de usuario ya está en uso. Elija otro."
}
```

---

### 🔑 Iniciar sesión
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "usuario": "juanperez",
  "contrasena": "miClave123"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Autenticación satisfactoria.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": "juanperez"
}
```

**Error - credenciales incorrectas (401):**
```json
{
  "exito": false,
  "mensaje": "Error en la autenticación: usuario o contraseña incorrectos."
}
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Node.js | Entorno de ejecución JavaScript |
| Express | Framework web para la API REST |
| bcryptjs | Cifrado seguro de contraseñas |
| jsonwebtoken | Generación de tokens JWT |
| uuid | Generación de IDs únicos |
| Git | Control de versiones |

---

## 🔒 Seguridad implementada

- Las contraseñas se almacenan cifradas con **bcrypt** (nunca en texto plano)
- La autenticación usa **JWT** (JSON Web Token) con expiración de 2 horas
- Los mensajes de error no revelan si el usuario existe o no (previene enumeración)

---

## 📋 Herramienta de Versionamiento

Este proyecto usa **Git** como herramienta de control de versiones.

Ver archivo `REPOSITORIO.txt` para el enlace del repositorio remoto.
