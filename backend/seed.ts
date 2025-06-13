// backend/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Inicializamos el cliente de Prisma
const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Crear Unidades de Negocio ---
  // Usamos 'upsert' para crear si no existe, o no hacer nada si ya existe (basado en el campo 'name').
  // Esto evita crear duplicados si corremos el script varias veces.
  const crucianelli = await prisma.businessUnit.upsert({
    where: { name: 'Crucianelli' },
    update: {},
    create: {
      name: 'Crucianelli',
    },
  });

  const leaf = await prisma.businessUnit.upsert({
    where: { name: 'Leaf' },
    update: {},
    create: {
      name: 'Leaf',
    },
  });

  const fertec = await prisma.businessUnit.upsert({
    where: { name: 'Fertec' },
    update: {},
    create: {
      name: 'Fertec',
    },
  });

  console.log('Business units created.');

  // --- Crear Catálogos para los desplegables ---
  const callerTypes = ['Cliente Final', 'Concesionario', 'Interno'];
  for (const name of callerTypes) {
    await prisma.callerType.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Caller types created.');
  
  const machineTypes = ['Gringa', 'Pionera', 'Plantor', 'Otra'];
   for (const name of machineTypes) {
    await prisma.machineType.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Machine types created.');

  const dealerships = ['Agro-Gestion', 'Agro-Soluciones Sur', 'Maquinarias del Litoral', 'Tecno Campo'];
   for (const name of dealerships) {
    await prisma.dealership.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Dealerships created.');

  const inquiryAreas = ['Repuestos', 'Ingeniería', 'Servicios', 'Administración', 'Garantía'];
   for (const name of inquiryAreas) {
    await prisma.inquiryArea.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Inquiry areas created.');

  const responseReasons = ['Consulta técnica', 'Pedido de repuesto', 'Queja', 'Sugerencia', 'Seguimiento'];
   for (const name of responseReasons) {
    await prisma.responseReason.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Response reasons created.');

  const contactChannels = ['Llamada Telefónica', 'WhatsApp', 'Email', 'Presencial'];
   for (const name of contactChannels) {
    await prisma.contactChannel.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Contact channels created.');

  const durationRanges = ['Menos de 5 min', '5-15 min', '15-30 min', 'Más de 30 min'];
   for (const name of durationRanges) {
    await prisma.durationRange.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Duration ranges created.');

  const urgencyLevels = ['Baja', 'Normal', 'Alta', 'Crítica'];
   for (const name of urgencyLevels) {
    await prisma.urgencyLevel.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Urgency levels created.');
  // --- Crear Usuarios ---
    // --- Crear un Usuario de Prueba ---
  const saltRounds = 10;
  const plainPassword = 'admin'; // La contraseña que usaremos para loguearnos
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

  await prisma.user.upsert({
    where: { email: 'admin@crucianelli.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@crucianelli.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Test user created: admin@crucianelli.com / admin');

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cerrar la conexión a la base de datos
    await prisma.$disconnect();
  });
