// backend/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Crear Unidades de Negocio ---
  await prisma.businessUnit.upsert({ where: { name: 'Crucianelli' }, update: {}, create: { name: 'Crucianelli' } });
  await prisma.businessUnit.upsert({ where: { name: 'Leaf' }, update: {}, create: { name: 'Leaf' } });
  await prisma.businessUnit.upsert({ where: { name: 'Fertec' }, update: {}, create: { name: 'Fertec' } });
  console.log('Business units created.');

  // --- UNIFICANDO CATÁLOGOS CON OPCIONES DE FERTEC ---
  const fertecCallerTypes = ['Concesionario', 'Mecánico de fábrica', 'Comercial de fábrica', 'Cliente', 'Otro'];
  for (const name of fertecCallerTypes) await prisma.callerType.upsert({ where: { name }, update: {}, create: { name } });
  
  const fertecResponseReasons = ['Falla, reemplazo o envío de componente Electronico', 'Falla, reemplazo o envío de componente Hidraulico', 'Falla, reemplazo o envío de componente Mecánico', 'Asistencia configuración', 'Asistencia regulación', 'Respuesta técnica Electronica', 'Respuesta técnica Hidraulica', 'Respuesta técnica Mecánica'];
  for (const name of fertecResponseReasons) await prisma.responseReason.upsert({ where: { name }, update: {}, create: { name } });

  const fertecUrgencyLevels = ['Urgente', 'No urgente'];
  for (const name of fertecUrgencyLevels) await prisma.urgencyLevel.upsert({ where: { name }, update: {}, create: { name } });
  
  const fertecDurationOptions = ['Menos de 5 minutos (Llamadas)', 'Entre 5 y 10 minutos (Llamadas)', 'Entre 10 y 20 minutos (Llamadas)', 'Entre 20 y 35 minutos (Llamadas)', 'Entre 35 y 60 minutos (Llamadas)', 'Mas de 1 hora (Llamadas)', 'Menos de 5 minutos (Whatsapp corto)', 'Entre 5 y 15 minutos (Whatsapp medio)', 'Entre 15 y 60 minutos (Whatsapp largo)'];
  for (const name of fertecDurationOptions) await prisma.durationRange.upsert({ where: { name }, update: {}, create: { name } });
  
  const fertecInquiryAreas = ['Accesorios', 'Chasis', 'Cuchillas, Discos', 'Cuerpo fertilizador', 'Dosificador de fertilizante', 'Equipo hidráulico', 'Lanza', 'Leaf', 'Mando de fertilización mecánico', 'Medios de accesos a tolvas', 'Sistema de sustentación', 'Sistema de transporte de fertilizante', 'Tolvas', 'Cuffia', 'Platos de distribución'];
  for (const name of fertecInquiryAreas) await prisma.inquiryArea.upsert({ where: { name }, update: {}, create: { name } });
  
  console.log('Unified catalogs updated with Fertec options.');

  // --- SEMBRAR NUEVO CATÁLOGO DE FERTEC ---
  const fertecMachineTypes = ['Fertilizadora de arrastre', 'Fertilizadora Autopropulsada', 'Incorporadora', 'Semi remolque'];
  for (const name of fertecMachineTypes) {
    await prisma.fertecMachineType.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Fertec Machine Types created.');
  
  // --- Catálogos Comunes (Ya unificados) ---
  const callerTypes = ['Cliente Final', 'Concesionario', 'Interno', 'Mecánico de fábrica', 'Comercial de fábrica', 'Técnico externo'];
  for (const name of callerTypes) await prisma.callerType.upsert({ where: { name }, update: {}, create: { name } });
  const machineTypes = ['Gringa', 'Pionera', 'Plantor', 'Otra'];
  for (const name of machineTypes) await prisma.machineType.upsert({ where: { name }, update: {}, create: { name } });
  const dealerships = ["Agrícola Arrecifes","Agrícola Noroeste","Agrícola Rafaela S.A.","Agro de Souza S.A.","Agro Scheidegger","Agro Sur S.A.C.I.F.I.A.","Agrocomercial Chivilcoy","Agromaq Saladillo S.R.L.","Alonso Maquinarias","Altamirano Oscar A. Maquinaria","Álvarez Maquinarias","Anta Maquinarias S.R.L.","Botto Víctor","Calatroni Javier","Caminiti Caminos","Caon Maquinarias","Castagno y Priotti S.A.S.","Centeno maquinarias","Ciagro","Combes Gabriel","Corporacion de Máquinaria Sa","Cosechar S.A.","Cri - Mag","Criolani","Depetris","Distribuidora Z","Echevarria","El Marrullero","EQ S.A.","Ferrari maquinarias","Frare Hernán","Gondra","Guerrero Carlos","Implementos Quadri SRL","Lanzetti","Litoral Comercial S.A","Luciano Salvador","Luis S Ferro","M.F.M. Rural S.R.L.","Maquiagro (Moralejo)","Máquinas del Centro","Maratta maquinarias","Net Multiagro SRL","Pajín maquinarias S.A","Pallotti Diego","Perracino","Perticarini","Pintucci y Gûizzo","Pozzi Maquinarias","Realicó Agrosoluciones (RAS)","Sabbione","Schmidt Mauricio","Silvia Lombardi","Silvio Quevedo","Spitale Osvaldo","Sur Pampa S.A.(Uribe)","Taborro Omar","Tecnomac","Todo Campo (Salum)","Vagliengo Maquinarias","Weinbaur","Wirz Carlos","Zappelli"];
  for (const name of dealerships) await prisma.dealership.upsert({ where: { name }, update: {}, create: { name } });
  
  // --- Catálogos Específicos de Leaf ---
  const leafProductTypes = ["Orizon", "Piloto Automático", "Orion", "Smart Press", "Dosificador", "Dosify", "Deep Agro"];
  for (const name of leafProductTypes) await prisma.leafProductType.upsert({ where: { name }, update: {}, create: { name } });
  const complaintLocations = ["Cableado", "Controlador", "ECU de control", "Sensores", "Software / Configuración", "Fuente de alimentación", "Actualización de software", "Comunicación entre módulos", "Unidad de control hidráulico", "Base de datos", "Otro"];
  for (const name of complaintLocations) await prisma.complaintLocation.upsert({ where: { name }, update: {}, create: { name } });
  
  // --- Usuario de Prueba ---
  const saltRounds = 10;
  const plainPassword = 'admin';
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  await prisma.user.upsert({
    where: { email: 'admin@crucianelli.com' },
    update: {},
    create: { name: 'Administrador', email: 'admin@crucianelli.com', password: hashedPassword, role: 'ADMIN' },
  });
  console.log('Test user created/updated.');

  console.log(`Seeding finished.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
