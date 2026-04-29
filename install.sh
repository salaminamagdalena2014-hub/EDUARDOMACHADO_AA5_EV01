#!/bin/bash
# ============================================================
# Script de instalación y configuración - EO App API
# ============================================================

echo "🚀 Iniciando instalación de EO App API..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Verificar si .env existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor, edita .env con tus credenciales de MySQL"
else
    echo "✅ Archivo .env ya existe"
fi

# 3. Mensaje final
echo ""
echo "═══════════════════════════════════════════════════════"
echo "✅ Instalación completada"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env con tus credenciales de MySQL"
echo "2. Ejecuta el script SQL: src/database/schema.sql en MySQL"
echo "3. Inicia el servidor: npm run dev"
echo ""
echo "La API estará disponible en: http://localhost:3000"
echo "Documentación: API_DOCUMENTATION.md"
echo "═══════════════════════════════════════════════════════"
