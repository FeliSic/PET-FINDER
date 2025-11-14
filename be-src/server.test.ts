import express from 'express';
import cors from 'cors';
import sequelize from './database/db';
import './models/resend';
import './models/cloudinary';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { createUser, loginUser, createPet, getUser, createReport } from './controllers/allController';
import { User, Pet, Report } from './models/models';
import { expect } from 'chai';
import request from 'supertest';

// ============================================
// SERVER SETUP PARA TESTING
// ============================================
const app = express();
const port = 3001; // Puerto diferente para testing

app.use(cors());
app.use(express.json());

// ============================================
// User & Auth zone
// ============================================

app.post("/profile", async (req: Request, res: Response) => {
  const datos: { 
    email: string; 
    password: string; 
    confirmPassword: string;
    name?: string;
    location?: {
      name: string;
      lat: number;
      lng: number;
    };
  } = req.body;
  
  try {
    const newUser = await createUser(datos);
    res.status(201).json({
      "Usuario y Auth creados": newUser,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/profile/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/profile/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const findUser = await getUser(userId);
    if (!findUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(findUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/profileDate/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { name, location } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (name !== undefined) user.name = name;
    if (location !== undefined) user.location = location;

    await user.save();

    res.status(200).json({ 
      message: "Datos actualizados correctamente",
      user: {
        id: user.id,
        name: user.name,
        location: user.location
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/profilePassword/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { contraseña, confirmarContraseña } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    if (contraseña !== confirmarContraseña) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }
    const hashedPassword = crypto.createHash("sha256").update(contraseña).digest("hex");
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Contraseña cambiada correctamente" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Pet zone
// ============================================

app.post("/post-pets", async (req: Request, res: Response) => {
  const datos: {
    nombre: string;
    bio: string;
    location: {
      name: string;
      lat: number;
      lng: number;
    };
    img: string;
    userId: number;
  } = req.body;

  try {
    const user = await User.findByPk(datos.userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!datos.img || !datos.img.startsWith('https://res.cloudinary.com/')) {
      return res.status(400).json({
        error: "La imagen debe ser una URL válida de Cloudinary"
      });
    }

    const newPet = await createPet(datos);
    res.status(201).json({
      message: "Mascota reportada exitosamente",
      pet: newPet
    });
  } catch (error: any) {
    console.error('Error al crear mascota:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/lost-pets", async (req: Request, res: Response) => {
  try {
    const lostPets = await Pet.findAll({
      where: { status: "lost" },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    res.status(200).json(lostPets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/pet-status/:petId", async (req: Request, res: Response) => {
  const { petId } = req.params;
  const { status } = req.body;

  if (!['lost', 'found'].includes(status)) {
    return res.status(400).json({ error: "Status debe ser 'lost' o 'found'" });
  }

  try {
    const pet = await Pet.findByPk(petId);
    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    pet.status = status;
    await pet.save();

    res.status(200).json({
      message: "Status actualizado correctamente",
      pet: {
        id: pet.id,
        nombre: pet.nombre,
        status: pet.status
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/nearby-pets", async (req: Request, res: Response) => {
  const { lat, lng, radius = 5 } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Se requiere latitud y longitud" });
  }

  try {
    const allPets = await Pet.findAll({
      where: { status: "lost" },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const nearbyPets = allPets.filter(pet => {
      const distance = calculateDistance(lat, lng, pet.location.lat, pet.location.lng);
      return distance <= radius;
    });

    res.status(200).json({
      userLocation: { lat, lng },
      radius: radius,
      count: nearbyPets.length,
      pets: nearbyPets
    });
  } catch (error: any) {
    console.error('Error al buscar mascotas cercanas:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Report zone - Avistajes
// ============================================

app.post("/report/:petId", async (req: Request, res: Response) => {
  const { petId } = req.params;
  const { reporterName, reporterPhone, location, message } = req.body;

  try {
    const report = await createReport({
      petId: parseInt(petId),
      reporterName,
      reporterPhone,
      location,
      message
    });

    res.status(201).json({
      message: "Reporte de avistaje enviado exitosamente",
      report
    });
  } catch (error: any) {
    console.error('Error al crear reporte:', error);
    res.status(400).json({ error: error.message });
  }
});

app.get("/reports/:petId", async (req: Request, res: Response) => {
  const { petId } = req.params;

  try {
    const reports = await Report.findAll({
      where: { petId: parseInt(petId) },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      count: reports.length,
      reports
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/my-reports/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const reports = await Report.findAll({
      where: { ownerId: parseInt(userId) },
      include: [
        {
          model: Pet,
          attributes: ['id', 'nombre', 'img']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      count: reports.length,
      reports
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Helper functions
// ============================================
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// ============================================
// MOCHA TESTS
// ============================================
describe("Pet Finder API Tests", function() {
  this.timeout(30000); // Aumentar timeout global

  // Sincronizar base de datos antes de los tests
  before(async function() {
    this.timeout(30000); // Timeout específico para setup
    try {
      await sequelize.sync({ force: true }); // force: true para limpiar en testing
      console.log('✓ Base de datos sincronizada para testing');
    } catch (error) {
      console.error('Error sincronizando BD:', error);
      throw error;
    }
  });

  // ============================================
  // PROFILE / AUTH TESTS
  // ============================================
  describe("AUTH - User Registration and Login", function() {
    let userId: number;
    const testUser = {
      email: "testuser@example.com",
      password: "TestPassword123",
      confirmPassword: "TestPassword123",
      name: "Test User"
    };

    it("Should create a new user", async function() {
      const response = await request(app)
        .post("/profile")
        .send(testUser)
        .expect(201);

      expect(response.body).to.have.property("Usuario y Auth creados");
      expect(response.body["Usuario y Auth creados"]).to.have.property("userId");
      expect(response.body["Usuario y Auth creados"]).to.have.property("email");
      userId = response.body["Usuario y Auth creados"].userId;
    });

    it("Should fail when passwords don't match", async function() {
      const invalidUser = {
        ...testUser,
        email: "another@example.com",
        confirmPassword: "DifferentPassword"
      };

      const response = await request(app)
        .post("/profile")
        .send(invalidUser)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("coinciden");
    });

    it("Should fail when password is less than 8 characters", async function() {
      const shortPassword = {
        ...testUser,
        email: "short@example.com",
        password: "short",
        confirmPassword: "short"
      };

      const response = await request(app)
        .post("/profile")
        .send(shortPassword)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("8 caracteres");
    });

    it("Should login with correct credentials", async function() {
      const response = await request(app)
        .post("/profile/login")
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).to.have.property("token");
      expect(response.body).to.have.property("userId");
      expect(response.body).to.have.property("message");
    });

    it("Should fail login with non-existent user", async function() {
      const response = await request(app)
        .post("/profile/login")
        .send({
          email: "nonexistent@example.com",
          password: "password"
        })
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("no encontrado");
    });

    it("Should fail login with incorrect password", async function() {
      const response = await request(app)
        .post("/profile/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123"
        })
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("incorrecta");
    });

    it("Should retrieve user by ID", async function() {
      const response = await request(app)
        .get(`/profile/${userId}`)
        .expect(200);

      expect(response.body).to.have.property("id", userId);
      expect(response.body).to.have.property("email");
      expect(response.body).to.have.property("name");
    });

    it("Should update user profile data", async function() {
      const updateData = {
        name: "Updated Name",
        location: {
          name: "Buenos Aires",
          lat: -34.6037,
          lng: -58.3816
        }
      };

      const response = await request(app)
        .put(`/profileDate/${userId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).to.have.property("message");
      expect(response.body.user.name).to.equal(updateData.name);
      expect(response.body.user.location).to.deep.equal(updateData.location);
    });

    it("Should change user password", async function() {
      const newPassword = {
        contraseña: "NewPassword123",
        confirmarContraseña: "NewPassword123"
      };

      const response = await request(app)
        .put(`/profilePassword/${userId}`)
        .send(newPassword)
        .expect(200);

      expect(response.body).to.have.property("message");
      expect(response.body.message).to.include("Contraseña cambiada");
    });

    it("Should fail when changing password with non-matching confirmation", async function() {
      const mismatchPassword = {
        contraseña: "AnotherPassword123",
        confirmarContraseña: "DifferentPassword123"
      };

      const response = await request(app)
        .put(`/profilePassword/${userId}`)
        .send(mismatchPassword)
        .expect(400);

      expect(response.body).to.have.property("error");
    });
  });

  // ============================================
  // PET TESTS
  // ============================================
  describe("PETS - Pet Management", function() {
    let userId: number;
    let petId: number;
    const testUser = {
      email: "petowner@example.com",
      password: "PetPassword123",
      confirmPassword: "PetPassword123",
      name: "Pet Owner"
    };

    const testPet = {
      nombre: "Max",
      bio: "Golden Retriever muy juguetón",
      location: {
        name: "Palermo, Buenos Aires",
        lat: -34.5899,
        lng: -58.3891
      },
      img: "https://res.cloudinary.com/demo/image/fetch/w_200/https://www.example.com/dog.jpg"
    };

    before(async function() {
      // Create a user for pet testing
      const userRes = await request(app)
        .post("/profile")
        .send(testUser);
      userId = userRes.body["Usuario y Auth creados"].userId;
    });

    it("Should create a new pet", async function() {
      const response = await request(app)
        .post("/post-pets")
        .send({ ...testPet, userId })
        .expect(201);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("pet");
      expect(response.body.pet).to.have.property("id");
      expect(response.body.pet.nombre).to.equal(testPet.nombre);
      expect(response.body.pet.status).to.equal("lost");
      petId = response.body.pet.id;
    });

    it("Should fail when creating pet without valid user", async function() {
      const response = await request(app)
        .post("/post-pets")
        .send({ ...testPet, userId: 9999 })
        .expect(404);

      expect(response.body).to.have.property("error");
    });

    it("Should fail when pet image is not from Cloudinary", async function() {
      const invalidPet = {
        ...testPet,
        userId,
        img: "https://example.com/dog.jpg"
      };

      const response = await request(app)
        .post("/post-pets")
        .send(invalidPet)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("Cloudinary");
    });

    it("Should get all lost pets", async function() {
      const response = await request(app)
        .get("/lost-pets")
        .expect(200);

      expect(Array.isArray(response.body)).to.be.true;
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body[0].status).to.equal("lost");
    });

    it("Should update pet status from lost to found", async function() {
      const response = await request(app)
        .put(`/pet-status/${petId}`)
        .send({ status: "found" })
        .expect(200);

      expect(response.body).to.have.property("message");
      expect(response.body.pet.status).to.equal("found");
    });

    it("Should fail when updating with invalid status", async function() {
      const response = await request(app)
        .put(`/pet-status/${petId}`)
        .send({ status: "invalid" })
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("lost");
    });

    it("Should find nearby pets", async function() {
      // Create another pet first
      const newPet = {
        nombre: "Luna",
        bio: "Gato siamés",
        location: {
          name: "San Telmo, Buenos Aires",
          lat: -34.6170,
          lng: -58.3706
        },
        img: "https://res.cloudinary.com/demo/image/fetch/w_200/https://www.example.com/cat.jpg",
        userId,
        status: "lost"
      };

      await request(app)
        .post("/post-pets")
        .send(newPet)
        .expect(201);

      const response = await request(app)
        .post("/nearby-pets")
        .send({
          lat: -34.6070,
          lng: -58.3816,
          radius: 10
        })
        .expect(200);

      expect(response.body).to.have.property("userLocation");
      expect(response.body).to.have.property("radius");
      expect(response.body).to.have.property("count");
      expect(response.body).to.have.property("pets");
      expect(Array.isArray(response.body.pets)).to.be.true;
    });

    it("Should fail nearby pets search without coordinates", async function() {
      const response = await request(app)
        .post("/nearby-pets")
        .send({ radius: 5 })
        .expect(400);

      expect(response.body).to.have.property("error");
    });
  });

  // ============================================
  // REPORT TESTS
  // ============================================
  describe("REPORTS - Pet Sightings", function() {
    let userId: number;
    let petId: number;
    let reportId: number;

    const testUser = {
      email: "reportowner@example.com",
      password: "ReportPassword123",
      confirmPassword: "ReportPassword123",
      name: "Report Owner"
    };

    const testPet = {
      nombre: "Buddy",
      bio: "Perro pequeño marrón",
      location: {
        name: "La Boca, Buenos Aires",
        lat: -34.6348,
        lng: -58.3621
      },
      img: "https://res.cloudinary.com/demo/image/fetch/w_200/https://www.example.com/buddy.jpg"
    };

    before(async function() {
      // Create user
      const userRes = await request(app)
        .post("/profile")
        .send(testUser);
      userId = userRes.body["Usuario y Auth creados"].userId;

      // Create pet
      const petRes = await request(app)
        .post("/post-pets")
        .send({ ...testPet, userId });
      petId = petRes.body.pet.id;
    });

    it("Should create a pet sighting report", async function() {
      const reportData = {
        reporterName: "Juan García",
        reporterPhone: "+54 9 11 5555-5555",
        location: "Caminito, La Boca",
        message: "Vi el perro cerca de la estación de subte"
      };

      const response = await request(app)
        .post(`/report/${petId}`)
        .send(reportData)
        .expect(201);

      expect(response.body).to.have.property("message");
      expect(response.body).to.have.property("report");
      expect(response.body.report).to.have.property("id");
      expect(response.body.report.reporterName).to.equal(reportData.reporterName);
      reportId = response.body.report.id;
    });

    it("Should fail report for non-existent pet", async function() {
      const reportData = {
        reporterName: "Carlos López",
        reporterPhone: "+54 9 11 6666-6666",
        location: "Plaza de Mayo",
        message: "Creo que vi el perro"
      };

      const response = await request(app)
        .post(`/report/9999`)
        .send(reportData)
        .expect(400);

      expect(response.body).to.have.property("error");
    });

    it("Should fail report with missing required fields", async function() {
      const incompleteReport = {
        reporterName: "Ana Martínez"
        // Missing reporterPhone, location
      };

      const response = await request(app)
        .post(`/report/${petId}`)
        .send(incompleteReport)
        .expect(400);

      expect(response.body).to.have.property("error");
      expect(response.body.error).to.include("obligatorios");
    });

    it("Should get all reports for a specific pet", async function() {
      // Create another report
      await request(app)
        .post(`/report/${petId}`)
        .send({
          reporterName: "María González",
          reporterPhone: "+54 9 11 7777-7777",
          location: "San Telmo",
          message: "Avistado en las calles"
        });

      const response = await request(app)
        .get(`/reports/${petId}`)
        .expect(200);

      expect(response.body).to.have.property("count");
      expect(response.body).to.have.property("reports");
      expect(Array.isArray(response.body.reports)).to.be.true;
      expect(response.body.count).to.equal(2);
    });

    it("Should get all reports for a specific user", async function() {
      const response = await request(app)
        .get(`/my-reports/${userId}`)
        .expect(200);

      expect(response.body).to.have.property("count");
      expect(response.body).to.have.property("reports");
      expect(Array.isArray(response.body.reports)).to.be.true;
      expect(response.body.reports.length).to.be.greaterThan(0);
    });

    it("Should have pet information in user reports", async function() {
      const response = await request(app)
        .get(`/my-reports/${userId}`)
        .expect(200);

      const report = response.body.reports[0];
      expect(report).to.have.property("Pet");
      expect(report.Pet).to.have.property("nombre");
      expect(report.Pet).to.have.property("img");
    });
  });

  // ============================================
  // INTEGRATION TESTS
  // ============================================
  describe("INTEGRATION - Full Workflow", function() {
    this.timeout(20000); // Timeout específico para tests de integración

    it("Should complete full workflow: register, create pet, report sighting", async function() {
      // 1. Register user
      const userRes = await request(app)
        .post("/profile")
        .send({
          email: "integration@example.com",
          password: "Integration123",
          confirmPassword: "Integration123",
          name: "Integration Test User"
        })
        .expect(201);

      const userId = userRes.body["Usuario y Auth creados"].userId;
      expect(userId).to.be.a("number");

      // 2. Create pet
      const petRes = await request(app)
        .post("/post-pets")
        .send({
          nombre: "Test Pet",
          bio: "Pet for integration testing",
          location: {
            name: "Test Location",
            lat: -34.6037,
            lng: -58.3816
          },
          img: "https://res.cloudinary.com/demo/image/fetch/w_200/https://www.example.com/test.jpg",
          userId
        })
        .expect(201);

      const petId = petRes.body.pet.id;
      expect(petId).to.be.a("number");

      // 3. Get lost pets and verify
      const petsRes = await request(app)
        .get("/lost-pets")
        .expect(200);

      const createdPet = petsRes.body.find((p: any) => p.id === petId);
      expect(createdPet).to.exist;

      // 4. Create sighting report
      const reportRes = await request(app)
        .post(`/report/${petId}`)
        .send({
          reporterName: "Integration Tester",
          reporterPhone: "+54 9 11 0000-0000",
          location: "Test Location",
          message: "Test sighting message"
        })
        .expect(201);

      expect(reportRes.body.report).to.have.property("id");

      // 5. Verify reports
      const reportsRes = await request(app)
        .get(`/reports/${petId}`)
        .expect(200);

      expect(reportsRes.body.count).to.equal(1);

      // 6. Update pet status
      const updateRes = await request(app)
        .put(`/pet-status/${petId}`)
        .send({ status: "found" })
        .expect(200);

      expect(updateRes.body.pet.status).to.equal("found");
    });
  });

  // Cleanup after tests
  after(async function() {
    try {
      await sequelize.close();
      console.log('✓ Conexión a BD cerrada');
    } catch (error) {
      console.error('Error cerrando BD:', error);
    }
  });
});
