// backend/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Crear Unidades de Negocio ---
  // Usamos 'upsert' para evitar duplicados si corremos el script varias veces.
  await prisma.businessUnit.upsert({
    where: { name: 'Crucianelli' },
    update: {},
    create: { name: 'Crucianelli' },
  });
  await prisma.businessUnit.upsert({
    where: { name: 'Leaf' },
    update: {},
    create: { name: 'Leaf' },
  });
  await prisma.businessUnit.upsert({
    where: { name: 'Fertec' },
    update: {},
    create: { name: 'Fertec' },
  });
  console.log('Business units created.');

  // ... (El resto del código de siembra para catálogos y el usuario admin se mantiene igual)
  const callerTypes = ['Cliente Final', 'Concesionario', 'Interno'];
  for (const name of callerTypes) {
    await prisma.callerType.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Caller types created.');
  
  // (etc... para los demás catálogos)


  // --- Crear un Usuario de Prueba ---
  const saltRounds = 10;
  const plainPassword = 'admin';
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
    await prisma.$disconnect();
  });
