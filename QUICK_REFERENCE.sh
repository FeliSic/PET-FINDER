#!/bin/bash
# Quick Test Reference for Pet Finder

# ==================================================
# INSTALACIÓN & SETUP
# ==================================================

# Instalar todas las dependencias (ejecutar una sola vez)
yarn install

# Compilar TypeScript
yarn build:be

# ==================================================
# EJECUTAR TESTS
# ==================================================

# Ejecutar todos los tests
yarn test

# Ejecutar tests en modo watch (auto-reload)
yarn test:watch

# Ejecutar solo tests de autenticación
yarn test --grep "Auth"

# Ejecutar solo tests de mascotas
yarn test --grep "Pets"

# Ejecutar solo tests de reportes
yarn test --grep "Reports"

# Ejecutar solo tests de integración
yarn test --grep "Integration"

# ==================================================
# DESARROLLO
# ==================================================

# Iniciar servidor backend en desarrollo
yarn dev:be

# Iniciar frontend con Parcel
yarn dev:fe

# ==================================================
# COMPILACIÓN & PRODUCCIÓN
# ==================================================

# Compilar backend a JavaScript
yarn build:be

# Compilar frontend
yarn build:fe

# Compilar todo (backend + frontend)
yarn build

# Iniciar servidor en producción
yarn start

# ==================================================
# INFORMACIÓN ÚTIL
# ==================================================

# Tests que incluye la suite:
# - 10 tests de Autenticación (login, registro, validaciones)
# - 8 tests de Mascotas (crear, actualizar, búsqueda)
# - 6 tests de Reportes (crear reportes, obtener datos)
# - 1 test de Integración (flujo completo)

# Archivos importantes:
# - be-src/server.test.ts → Todos los tests
# - TESTING.md → Documentación detallada
# - TEST_RESULTS.md → Resultados actuales

# Base de datos de tests:
# - Usa PostgreSQL (Neon)
# - Se recrea limpia para cada ejecución
# - Timeout de 30 segundos por test

# ==================================================
# TROUBLESHOOTING
# ==================================================

# Si los tests fallan por conexión a BD:
# 1. Verifica que PostgreSQL esté corriendo
# 2. Revisa las variables de entorno en .env
# 3. Asegúrate de que SEQUELIZE_URL es correcto

# Si hay timeout:
# - Aumenta el timeout en be-src/server.test.ts
# - this.timeout(60000) para 60 segundos

# Si necesitas limpiar:
# rm -rf node_modules be-dist
# yarn install
# yarn build:be
# yarn test

# ==================================================
# COMANDOS DE DEBUGGING
# ==================================================

# Ver últimos logs
yarn test 2>&1 | tail -50

# Ejecutar test específico con nombre exacto
yarn test --grep "Should create a new user"

# Ver conexión a BD
node -e "require('dotenv').config(); console.log(process.env.SEQUELIZE_URL)"
