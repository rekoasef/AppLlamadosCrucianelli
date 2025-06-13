// backend/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de sembrado...');

  // 1. Creación o actualización del usuario Admin
  console.log('Verificando usuario admin...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@crucianelli.com' },
    update: {},
    create: {
      email: 'admin@crucianelli.com',
      name: 'Admin',
      password: 'admin', // En una app real, esto debería ser un hash
      role: 'ADMIN',
    },
  });
  console.log('Usuario admin asegurado:', adminUser.email);

  // 2. Limpieza de los datos existentes para evitar duplicados
  console.log('Limpiando datos antiguos...');
  
  // -- LA CORRECCIÓN ESTÁ AQUÍ --
  // Primero borramos los registros de llamadas que dependen de los catálogos.
  await prisma.callRecord.deleteMany({});
  
  // Ahora sí podemos borrar los catálogos sin problemas.
  await prisma.callerType.deleteMany({});
  await prisma.machineType.deleteMany({});
  await prisma.dealership.deleteMany({});
  await prisma.inquiryArea.deleteMany({});
  await prisma.responseReason.deleteMany({});
  await prisma.contactChannel.deleteMany({});
  await prisma.durationRange.deleteMany({});
  await prisma.urgencyLevel.deleteMany({});
  console.log('Datos antiguos eliminados.');
  
  // 3. Creación de los nuevos catálogos basados en el PDF
  console.log('Creando nuevos catálogos...');
  
  const callerTypes = ['Concesionario', 'Mecánico de fábrica', 'Comercial de fábrica', 'Cliente', 'Otro'];
  await prisma.callerType.createMany({
    data: callerTypes.map(name => ({ name })),
  });
  console.log('Tipos de llamante creados.');

  const machineTypes = ['Gringa', 'Pionera', 'Drilor', 'Plantor', 'Mixia', 'Domina'];
  await prisma.machineType.createMany({
    data: machineTypes.map(name => ({ name })),
  });
  console.log('Tipos de máquina creados.');

  const dealerships = [
    'Agrícola Arrecifes', 'Agrícola Noroeste', 'Agrícola Rafaela S.A.', 'Agro de Souza S.A.',
    'Agro Scheidegger', 'Agro Sur S.A.C.I.F.I.A.', 'Agrocomercial Chivilcoy', 'Agromaq Saladillo S.R.L.',
    'Alonso Maquinarias', 'Altamirano Oscar A. Maquinaria', 'Álvarez Maquinarias', 'Anta Maquinarias S.R.L.',
    'Botto Víctor', 'Calatroni Javier', 'Caminiti Caminos', 'Caon Maquinarias', 'Castagno y Priotti S.A.S.',
    'Centeno maquinarias',
  ];
  await prisma.dealership.createMany({
    data: dealerships.map(name => ({ name })),
  });
  console.log('Concesionarios creados.');

  const inquiryAreas = [
    'Accesorios', 'Chasis', 'Cuchillas, Discos', 'Cuerpo de siembra', 'Dosificador de fertilizante',
    'Dosificador de semillas', 'Equipo hidráulico', 'Lanza', 'Leaf', 'Mando de siembra y fertilizacion mecánico',
    'Marcadores', 'Medios de accesos a tolvas', 'Precision Planting', 'Sistema de aspiración',
    'Sistema de sustentación', 'Sistema de transporte semilla - fertilizante', 'Tolvas',
  ];
  await prisma.inquiryArea.createMany({
    data: inquiryAreas.map(name => ({ name })),
  });
  console.log('Áreas de consulta creadas.');

  const responseReasons = [
    'Falla, reemplazo o envío de componente Electronico', 'Falla, reemplazo o envío de componente Hidraulico',
    'Falla, reemplazo o envío de componente Mecánico', 'Asistencia configuración', 'Asistencia regulación',
    'Respuesta técnica Electronica', 'Respuesta técnica Hidraulica', 'Respuesta técnica Mecánica',
  ];
  await prisma.responseReason.createMany({
    data: responseReasons.map(name => ({ name })),
  });
  console.log('Motivos de respuesta creados.');

  const contactChannels = ['Telefonico', 'WhatsApp'];
  await prisma.contactChannel.createMany({
    data: contactChannels.map(name => ({ name })),
  });
  console.log('Canales de contacto creados.');

  const durationRanges = [
    'Menos de 5 minutos (Llamadas)', 'Entre 5 y 10 minutos (Llamadas)', 'Entre 10 y 20 minutos (Llamadas)',
    'Entre 20 y 35 minutos (Llamadas)', 'Entre 35 y 60 minutos (Llamadas)', 'Mas de 1 hora (Llamadas)',
    'Menos de 5 minutos (Whatsapp corto)', 'Whatsapp normal (mas de 5 minutos)', 'Videollamada',
  ];
  await prisma.durationRange.createMany({
    data: durationRanges.map(name => ({ name })),
  });
  console.log('Rangos de duración creados.');

  const urgencyLevels = ['Baja', 'Normal', 'Alta', 'Urgente'];
  await prisma.urgencyLevel.createMany({
    data: urgencyLevels.map(name => ({ name })),
  });
  console.log('Niveles de urgencia creados.');

  console.log('Sembrado de catálogos completado.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });