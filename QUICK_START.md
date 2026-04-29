# ⚡ QUICK START - Comenzar en 5 minutos

## 📋 Checklist Rápido

### 1️⃣ Clonar/Acceder al proyecto
```bash
cd EDUARDOMACHADO_AA5_EV01
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar base de datos
```bash
# Windows
install.bat

# Linux/Mac
bash install.sh
```

O manualmente:
```bash
cp .env.example .env
# Editar .env con tus credenciales MySQL
```

### 4️⃣ Crear esquema en MySQL
```bash
# Opción 1: MySQL Workbench
# File → Open SQL Script → src/database/schema.sql

# Opción 2: Línea de comandos
mysql -u root -p eo_app_db < src/database/schema.sql
```

### 5️⃣ Iniciar servidor
```bash
npm run dev
```

✅ **¡Servidor corriendo en http://localhost:3000**

---

## 🧪 Probar la API (5 segundos)

### Opción A: Postman (Recomendado)
1. Abrir Postman
2. Importar: `EO_App_API.postman_collection.json`
3. Crear variable `TOKEN` automáticamente
4. ¡Listo!

### Opción B: cURL
```bash
# Registrar
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Pérez","correo":"juan@test.com","cedula":"123","contrasena":"password123"}'

# Ver home
curl http://localhost:3000
```

### Opción C: Thunder Client (VS Code)
1. Instalar extensión
2. Importar colección
3. ¡Listo!

---

## 📱 Primeras Acciones

### 1. Registrarse
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@test.com",
  "cedula": "1234567890",
  "contrasena": "password123"
}
```

**Respuesta:** Recibirás un `token` JWT

### 2. Ver categorías (requiere token)
```bash
GET http://localhost:3000/api/categorias
Authorization: Bearer {token_recibido}
```

### 3. Crear transacción
```bash
POST http://localhost:3000/api/transacciones
Authorization: Bearer {token_recibido}
Content-Type: application/json

{
  "id_categoria": 5,
  "tipo": "gasto",
  "monto": 50000,
  "descripcion": "Almuerzo",
  "fecha": "2024-04-29"
}
```

### 4. Ver reportes
```bash
GET http://localhost:3000/api/reportes/resumen-mensual
Authorization: Bearer {token_recibido}
```

---

## 🆘 Solución de Problemas

| Problema | Solución |
|----------|----------|
| **Error: "connect ECONNREFUSED 127.0.0.1:3306"** | MySQL no está corriendo. Reinicia el servicio MySQL |
| **Error: "ER_BAD_DB_ERROR"** | Ejecuta el script SQL: `schema.sql` |
| **Error: "listen EADDRINUSE :::3000"** | Puerto 3000 ocupado. Cambia en `.env` o cierra la app |
| **Error: 401 "Token inválido"** | Token expirado. Haz login de nuevo |
| **Error: 404 "Ruta no encontrada"** | Verifica la URL del endpoint |

---

## 🔗 Documentación

| Documento | Contenido |
|-----------|----------|
| **README.md** | Descripción general |
| **API_DOCUMENTATION.md** | 26 endpoints documentados |
| **GUIA_USO.md** | Casos de uso prácticos |
| **ESTRUCTURA.md** | Estructura del proyecto |
| **PROYECTO_RESUMEN.md** | Resumen completo |
| **QUICK_START.md** | Este archivo |

---

## 📊 Endpoints Principales

### Autenticación
```
POST /api/auth/register           Registrarse
POST /api/auth/login              Login
POST /api/auth/logout             Logout
```

### Transacciones
```
GET  /api/transacciones           Listar
POST /api/transacciones           Crear
```

### Metas
```
GET  /api/metas                   Listar
POST /api/metas                   Crear
```

### Reportes
```
GET /api/reportes/resumen-mensual        Resumen
GET /api/reportes/gastos-por-categoria   Gastos
GET /api/reportes/progreso-metas         Metas
```

---

## 💡 Variables de Entorno (.env)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tuPassword
DB_NAME=eo_app_db
DB_PORT=3306

JWT_SECRET=tu_clave_secreta_2024
JWT_EXPIRATION=7d

PORT=3000
NODE_ENV=development
```

---

## 🎯 Flujo Típico

```
1. Registrarse/Login
         ↓
   Obtener token JWT
         ↓
   Usar token en requests
         ↓
   Crear transacciones
         ↓
   Crear metas
         ↓
   Ver reportes
```

---

## ✅ Verificar que Todo Funciona

```bash
# 1. Servidor corriendo
curl http://localhost:3000

# 2. Base de datos conectada
# Deberías ver: ✅ Conexión a MySQL establecida

# 3. Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","apellido":"User","correo":"test@test.com","cedula":"000","contrasena":"test123"}'

# 4. Si recibes token → ¡Todo funciona! 🎉
```

---

## 🚀 Próximos Pasos

1. ✅ Instala dependencias
2. ✅ Configura base de datos
3. ✅ Inicia servidor
4. ✅ Prueba endpoints con Postman
5. ✅ Integra con tu frontend
6. ✅ Lee documentación completa

---

## 📞 Soporte

**Documentación Completa:** Ver `API_DOCUMENTATION.md`  
**Guía de Uso:** Ver `GUIA_USO.md`  
**Repositorio:** https://github.com/salaminamagdalena2014-hub/EDUARDOMACHADO_AA5_EV01

---

**¡Que disfrutes la API! 🚀**

*Versión 1.0.0 - 29 de abril de 2024*
