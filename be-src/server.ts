import express from 'express';
import cors from 'cors';
import sequelize from './database/db';
import './models/resend';
import './models/cloudinary';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { createUser, loginUser, createPet, getUser, createReport } from './controllers/allController';
import { User, Pet, Report } from './models/models';
import path from 'path';


const app = express();
const port = 3000;

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

// Cambiar status de mascota (lost/found)
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

// ============================================
// NUEVO: Endpoint para mascotas cercanas
// ============================================
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
// Función helper para calcular distancia
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
// Servir archivos estáticos del frontend
// ============================================
app.use(express.static(path.join(__dirname, '../fe-src')));

// ============================================
// Sincronizar DB e iniciar servidor
// ============================================
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tablas sincronizadas');
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch(console.error);