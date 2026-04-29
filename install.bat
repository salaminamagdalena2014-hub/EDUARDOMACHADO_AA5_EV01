@echo off
REM ============================================================
REM Script de instalación y configuración - EO App API (Windows)
REM ============================================================

echo 🚀 Iniciando instalacion de EO App API...

REM 1. Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

REM 2. Verificar si .env existe
if not exist ".env" (
    echo 📝 Creando archivo .env...
    copy .env.example .env
    echo ⚠️  Por favor, edita .env con tus credenciales de MySQL
) else (
    echo ✅ Archivo .env ya existe
)

REM 3. Mensaje final
echo.
echo ═════════════════════════════════════════════════════════
echo ✅ Instalacion completada
echo.
echo Proximos pasos:
echo 1. Edita .env con tus credenciales de MySQL
echo 2. Ejecuta el script SQL: src/database/schema.sql en MySQL
echo 3. Inicia el servidor: npm run dev
echo.
echo La API estara disponible en: http://localhost:3000
echo Documentacion: API_DOCUMENTATION.md
echo ═════════════════════════════════════════════════════════
