# 🔐 Servicio Web de Autenticación
**Evidencia: GA7-220501096-AA5-EV01**

API REST para registro e inicio de sesión de usuarios, desarrollada con Node.js y Express.

---

## 📁 Estructura del Proyecto

```
auth-api/
├── src/
│   ├── server.js                  # Punto de entrada del servidor
│   ├── routes/
│   │   └── authRoutes.js          # Definición de endpoints
│   ├── controllers/
│   │   └── authController.js      # Lógica de negocio
│   └── models/
│       └── usuarioModel.js        # Modelo de datos (BD en memoria)
├── .gitignore
├── package.json
├── REPOSITORIO.txt
└── README.md
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar o descomprimir el proyecto

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
