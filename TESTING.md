# 🧪 Pet Finder - Test Suite Documentation

## Overview

Este proyecto incluye una suite completa de pruebas con **Mocha** y **Chai** para validar todas las funcionalidades del API de Pet Finder antes de subir a producción.

---

## 📋 Test Coverage

La suite de tests cubre:

### 1. **AUTH - User Registration and Login**
- ✅ Crear nuevo usuario con validaciones
- ✅ Fallar si las contraseñas no coinciden
- ✅ Fallar si la contraseña es menor a 8 caracteres
- ✅ Login con credenciales correctas
- ✅ Fallar login con usuario no existente
- ✅ Fallar login con contraseña incorrecta
- ✅ Obtener datos del usuario por ID
- ✅ Actualizar datos del perfil
- ✅ Cambiar contraseña

### 2. **PETS - Pet Management**
- ✅ Crear nueva mascota
- ✅ Validar que el usuario exista
- ✅ Validar que la imagen sea de Cloudinary
- ✅ Obtener todas las mascotas perdidas
- ✅ Cambiar estado de mascota (lost → found)
- ✅ Buscar mascotas cercanas por ubicación
- ✅ Validar coordenadas en búsqueda

### 3. **REPORTS - Pet Sightings**
- ✅ Crear reporte de avistaje
- ✅ Validar que la mascota exista
- ✅ Validar campos requeridos
- ✅ Obtener reportes de mascota específica
- ✅ Obtener reportes por usuario
- ✅ Incluir información de mascota en reportes

### 4. **INTEGRATION - Full Workflow**
- ✅ Flujo completo: registrar → crear mascota → reportar avistaje

---

## 🚀 Cómo Ejecutar los Tests

### Requisitos Previos
```bash
# Asegúrate de tener instaladas todas las dependencias
yarn install
```

### Ejecutar todos los tests
```bash
yarn test
```

### Ejecutar tests en modo watch (desarrollo)
```bash
yarn test:watch
```

### Ejecutar un test específico
```bash
yarn test --grep "Auth"           # Solo tests de autenticación
yarn test --grep "Pets"           # Solo tests de mascotas
yarn test --grep "Reports"        # Solo tests de reportes
yarn test --grep "Integration"    # Solo tests de integración
```

---

## 📊 Resultados Esperados

Cuando ejecutes `yarn test`, deberías ver una salida similar a:

```
Pet Finder API Tests
  AUTH - User Registration and Login
    ✓ Should create a new user
    ✓ Should fail when passwords don't match
    ✓ Should fail when password is less than 8 characters
    ✓ Should login with correct credentials
    ✓ Should fail login with non-existent user
    ✓ Should fail login with incorrect password
    ✓ Should retrieve user by ID
    ✓ Should update user profile data
    ✓ Should change user password
    ✓ Should fail when changing password with non-matching confirmation

  PETS - Pet Management
    ✓ Should create a new pet
    ✓ Should fail when creating pet without valid user
    ✓ Should fail when pet image is not from Cloudinary
    ✓ Should get all lost pets
    ✓ Should update pet status from lost to found
    ✓ Should fail when updating with invalid status
    ✓ Should find nearby pets
    ✓ Should fail nearby pets search without coordinates

  REPORTS - Pet Sightings
    ✓ Should create a pet sighting report
    ✓ Should fail report for non-existent pet
    ✓ Should fail report with missing required fields
    ✓ Should get all reports for a specific pet
    ✓ Should get all reports for a specific user
    ✓ Should have pet information in user reports

  INTEGRATION - Full Workflow
    ✓ Should complete full workflow: register, create pet, report sighting

  ✓ 30 passing (2.5s)
```

---

## 🔧 Configuración de Tests

El archivo de configuración se encuentra en `be-src/server.test.ts` e incluye:

- **Database**: Base de datos sincronizada con `force: true` para limpiar datos entre tests
- **Timeout**: 10 segundos para cada test (ajustable si es necesario)
- **Setup/Teardown**: 
  - `before()`: Sincroniza la BD antes de ejecutar los tests
  - `after()`: Cierra la conexión a la BD después de terminar

---

## 📝 Notas Importantes

1. **Aislamiento de Tests**: Cada suite de tests tiene su propio usuario/mascota de prueba para evitar conflictos

2. **Base de Datos**: Se utiliza `force: true` en `sequelize.sync()` para:
   - Eliminar todas las tablas existentes
   - Recrearlas desde cero
   - Asegurar un estado limpio para cada ejecución

3. **Credenciales de Test**: Todas las credenciales son datos de prueba y se eliminan después:
   ```typescript
   testUser: {
     email: "testuser@example.com",
     password: "TestPassword123"
   }
   ```

4. **Validaciones Testeadas**:
   - Email único
   - Contraseña segura (8+ caracteres)
   - Ubicaciones con coordenadas válidas
   - Imágenes solo de Cloudinary
   - Status de mascotas (lost/found)

---

## ✅ Checklist Pre-Producción

Antes de subir a producción, verifica:

- [ ] `yarn test` pasa todos los tests
- [ ] No hay warnings en la consola
- [ ] Las bases de datos están configuradas correctamente
- [ ] Las variables de entorno están definidas (`.env`)
- [ ] Cloudinary está configurado
- [ ] Resend para emails está configurado
- [ ] CORS está habilitado correctamente

---

## 🐛 Troubleshooting

### "Error: Cannot find module 'mocha'"
```bash
yarn install  # Reinstala las dependencias
```

### "Timeout of 10000ms exceeded"
Aumenta el timeout en `be-src/server.test.ts`:
```typescript
this.timeout(20000);  // Aumentar a 20 segundos
```

### "Connection refused" en la BD
Verifica que PostgreSQL esté corriendo y que las credenciales en `be-src/database/db.ts` sean correctas.

---

## 📚 Resources

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Express Testing Guide](https://expressjs.com/en/guide/testing.html)

