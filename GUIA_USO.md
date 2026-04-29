# Guía de Uso de la API - EO App

## 🎯 Objetivos de la API

Esta API permite a los usuarios:
1. **Autenticarse** de forma segura con JWT
2. **Gestionar su perfil** personal
3. **Administrar categorías** de ingresos y gastos
4. **Registrar transacciones** financieras
5. **Crear y monitorear metas** de ahorro
6. **Visualizar reportes** financieros

---

## 🔑 Conceptos Clave

### JWT (JSON Web Tokens)
- Token que se genera después de login/registro
- Se envía en cada solicitud a rutas protegidas
- Contiene la identidad del usuario (id y correo)
- Caduca según configuración (por defecto 7 días)

### Rutas Protegidas vs Públicas
- **Públicas**: Registro, Login (no requieren token)
- **Protegidas**: Todas las demás (requieren token en Authorization header)

### Estructura de Respuestas
```json
{
  "success": true/false,
  "message": "Descripción de la acción",
  "data": null | objeto | array
}
```

---

## 📋 Flujo Típico de Uso

### 1️⃣ Registro de Usuario
```bash
POST /api/auth/register
```
**Entrada:**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "cedula": "1234567890",
  "contrasena": "MiPassword123"
}
```
**Salida:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2️⃣ Login
```bash
POST /api/auth/login
```

### 3️⃣ Ver Perfil
```bash
GET /api/usuarios/1
Headers: Authorization: Bearer <token>
```

### 4️⃣ Crear Transacción
```bash
POST /api/transacciones
Headers: Authorization: Bearer <token>
```

### 5️⃣ Ver Reportes
```bash
GET /api/reportes/resumen-mensual
Headers: Authorization: Bearer <token>
```

---

## 🛠️ Uso en Postman

### Configuración Inicial
1. **Crear colección** "EO App API"
2. **Crear carpetas**:
   - Auth
   - Usuarios
   - Categorías
   - Transacciones
   - Metas
   - Reportes

### Variables de Entorno
```
BASE_URL = http://localhost:3000
TOKEN = (se actualiza automáticamente)
USER_ID = 1
```

### Pre-request Script (en login)
```javascript
// Ninguno necesario
```

### Tests Script (en login)
```javascript
pm.environment.set("TOKEN", pm.response.json().data.token);
```

### Header por defecto en rutas protegidas
```
Authorization: Bearer {{TOKEN}}
```

---

## 💡 Casos de Uso Comunes

### Caso 1: Nuevo Usuario registra sus gastos

```bash
# 1. Registrarse
POST /api/auth/register
{
  "nombre": "María",
  "apellido": "García",
  "correo": "maria@example.com",
  "cedula": "9876543210",
  "contrasena": "Password456"
}
# Obtiene token: token123

# 2. Crear transacción de gasto
POST /api/transacciones
Headers: Authorization: Bearer token123
{
  "id_categoria": 5,  // Alimentación (del sistema)
  "tipo": "gasto",
  "monto": 75000,
  "descripcion": "Almuerzo en restaurante",
  "fecha": "2024-04-29"
}

# 3. Crear transacción de ingreso
POST /api/transacciones
{
  "id_categoria": 1,  // Salario (del sistema)
  "tipo": "ingreso",
  "monto": 3000000,
  "descripcion": "Salario del mes",
  "fecha": "2024-04-25"
}

# 4. Ver resumen mensual
GET /api/reportes/resumen-mensual
```

### Caso 2: Usuario crea meta de ahorro

```bash
# 1. Crear meta
POST /api/metas
{
  "nombre": "Laptop Nueva",
  "descripcion": "Computadora para trabajo",
  "monto_objetivo": 2000000,
  "fecha_inicio": "2024-04-01",
  "fecha_limite": "2024-12-31"
}
# Obtiene: id_meta: 1, monto_actual: 0, progreso: 0%

# 2. Crear transacción que se asigne a la meta
POST /api/transacciones
{
  "id_categoria": 1,  // Ahorro personalizada
  "tipo": "ingreso",
  "monto": 500000,
  "descripcion": "Ahorro para laptop",
  "fecha": "2024-04-29"
}
# Obtiene: id_transaccion: 5

# 3. Asociar transacción a meta
POST /api/metas/1/transacciones
{
  "id_transaccion": 5,
  "monto_asignado": 500000
}
# Meta se actualiza: monto_actual: 500000, progreso: 25%

# 4. Ver progreso de metas
GET /api/reportes/progreso-metas
```

### Caso 3: Crear categoría personalizada

```bash
# 1. Ver categorías (sistema + del usuario)
GET /api/categorias
# Retorna todas las del sistema

# 2. Crear categoría personalizada
POST /api/categorias
{
  "nombre": "Trabajo Freelance",
  "tipo": "ingreso",
  "color": "#3b82f6",
  "icono": "code"
}
# Obtiene: id_categoria: 12, es_sistema: 0

# 3. Usar la categoría en transacciones
POST /api/transacciones
{
  "id_categoria": 12,
  "tipo": "ingreso",
  "monto": 1500000,
  "descripcion": "Proyecto freelance completado",
  "fecha": "2024-04-29"
}
```

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| 400 Bad Request | Datos incompletos | Verificar que todos los campos obligatorios estén presentes |
| 401 Unauthorized | Token faltante o inválido | Incluir token válido en Authorization header |
| 403 Forbidden | Acceso a datos de otro usuario | Solo puede acceder a sus propios datos |
| 404 Not Found | Recurso no existe | Verificar IDs, especialmente id_categoria, id_transaccion |
| 409 Conflict | Email o cédula duplicados | Usar correo y cédula únicos |

---

## 🔍 Tips y Trucos

### Filtrar transacciones por rango de fechas
```bash
GET /api/transacciones?tipo=gasto&fecha_inicio=2024-04-01&fecha_fin=2024-04-30
```

### Filtrar metas por estado
```bash
GET /api/metas?estado=en_progreso
# O estado=completada, cancelada
```

### Exportar datos de reportes
```bash
GET /api/reportes/gastos-por-categoria
# Guardar respuesta como JSON, luego importar en Excel
```

### Cambiar contraseña
```bash
PUT /api/usuarios/1/password
{
  "contrasena_actual": "MiPassword123",
  "contrasena_nueva": "NuevaPassword456",
  "contrasena_confirmar": "NuevaPassword456"
}
```

---

## 📱 Integración con Frontend

### Ejemplo con JavaScript/Fetch

```javascript
// Función auxiliar para llamadas a API
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`http://localhost:3000/api${endpoint}`, options);
  return response.json();
}

// Registrarse
async function registro(nombre, apellido, correo, cedula, contrasena) {
  const result = await apiCall('/auth/register', 'POST', {
    nombre, apellido, correo, cedula, contrasena
  });
  if (result.success) {
    localStorage.setItem('token', result.data.token);
  }
  return result;
}

// Obtener transacciones
async function obtenerTransacciones() {
  return await apiCall('/transacciones');
}

// Crear transacción
async function crearTransaccion(id_categoria, tipo, monto, descripcion, fecha) {
  return await apiCall('/transacciones', 'POST', {
    id_categoria, tipo, monto, descripcion, fecha
  });
}
```

---

## 🚀 Próximos Pasos

1. **Instalar dependencias**: `npm install`
2. **Configurar .env** con tu base de datos MySQL
3. **Ejecutar schema.sql** para crear tablas
4. **Iniciar servidor**: `npm run dev`
5. **Probar endpoints** con Postman o cURL
6. **Integrar con tu frontend**

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar los logs del servidor
2. Verificar variables de entorno en `.env`
3. Asegurar que MySQL esté ejecutándose
4. Revisar la documentación completa: `API_DOCUMENTATION.md`

