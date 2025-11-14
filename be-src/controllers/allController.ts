import { User, Auth, Pet, Report } from "../models/models";
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail } from "../models/resend";

async function createUser(userData: {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
}) {
  if (typeof userData.email !== "string" || 
      typeof userData.password !== "string" || 
      typeof userData.confirmPassword !== "string") {
    throw new Error("Todos los campos deben ser strings");
  }

  if (userData.password !== userData.confirmPassword) {
    throw new Error("Las contraseñas no coinciden");
  }

  if (userData.password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres");
  }

  const hashedPassword = crypto.createHash("sha256").update(userData.password).digest("hex");

  const newUser = await User.create({
    email: userData.email,
    password: hashedPassword,
    name: userData.name,
    location: userData.location || null
  });
  
  return {
    userId: newUser.id,
    email: newUser.email
  };
}

async function loginUser(email: string, password: string) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Usuario no encontrado");

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");

  if (user.password !== hashedPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jsonwebtoken.sign({ userId: user.id }, 'sarasas', { expiresIn: '5m' });
  await Auth.create({ token });

  const subject = 'Tu token de acceso';
  const html = `
    <h1>Hola!</h1>
    <p>Gracias por iniciar sesión. Aquí tienes tu token de acceso:</p>
    <p><strong>${token}</strong></p>
    <p>Este token es válido por 5 minutos. ¡No lo compartas con nadie!</p>
    <p>Saludos,<br />Tu equipo de soporte</p>
  `;

  await sendEmail(user.email, subject, html);

  return { 
    message: "Token enviado al email", 
    token,
    userId: user.id 
  };
}

async function getUser(userId: string) {
  const userData = await User.findByPk(userId, {
    include: [
      { model: Pet, as: 'Pets' },
    ]
  });
  return userData;
}

async function createPet(petData: {
  nombre: string;
  bio: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  img: string;
  userId: number;
}) {
  if (typeof petData.nombre !== 'string' || 
      typeof petData.bio !== 'string' || 
      !petData.location ||
      typeof petData.location.name !== 'string' ||
      typeof petData.location.lat !== 'number' ||
      typeof petData.location.lng !== 'number' ||
      typeof petData.img !== 'string' || 
      typeof petData.userId !== 'number') {
    throw new Error('Todos los campos deben ser válidos');
  }

  if (!petData.nombre.trim() || 
      !petData.bio.trim() || 
      !petData.location.name.trim() ||
      !petData.img.trim()) {
    throw new Error('Todos los campos son obligatorios');
  }

  const newPet = await Pet.create({
    nombre: petData.nombre,
    bio: petData.bio,
    location: petData.location,
    status: "lost",
    img: petData.img,
    userId: petData.userId
  });

  return newPet;
}

async function createReport(reportData: {
  petId: number;
  reporterName: string;
  reporterPhone: string;
  location: string;
  message?: string;
}) {
  if (!reportData.petId || 
      !reportData.reporterName || 
      !reportData.reporterPhone || 
      !reportData.location) {
    throw new Error('Todos los campos son obligatorios');
  }

  const pet = await Pet.findByPk(reportData.petId, {
    include: [{ model: User }]
  });

  if (!pet) {
    throw new Error('Mascota no encontrada');
  }

  if (!pet.User) {
    throw new Error('No se encontró el dueño de la mascota');
  }

  const newReport = await Report.create({
    petId: reportData.petId,
    reporterName: reportData.reporterName,
    reporterPhone: reportData.reporterPhone,
    location: reportData.location,
    message: reportData.message || '',
    ownerId: pet.userId
  });

  const owner = pet.User;
  
  const subject = `¡Alguien vio a ${pet.nombre}!`;
  const html = `
    <h1>¡Buenas noticias!</h1>
    <p>Alguien reportó haber visto a tu mascota <strong>${pet.nombre}</strong>.</p>
    
    <h2>Datos del reporte:</h2>
    <ul>
      <li><strong>Nombre:</strong> ${reportData.reporterName}</li>
      <li><strong>Teléfono:</strong> ${reportData.reporterPhone}</li>
      <li><strong>Ubicación:</strong> ${reportData.location}</li>
      ${reportData.message ? `<li><strong>Mensaje:</strong> ${reportData.message}</li>` : ''}
      <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</li>
    </ul>
    
    <p>Te recomendamos contactar a esta persona lo antes posible.</p>
    
    <p>Saludos,<br />El equipo de Pet Finder</p>
  `;

  await sendEmail(owner.email, subject, html);

  return newReport;
}

export { createUser, loginUser, createPet, getUser, createReport };