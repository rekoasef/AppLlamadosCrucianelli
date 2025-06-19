// backend/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper para crear entradas únicas y devolverlas con sus IDs
const createUniqueEntries = async (model: any, names: string[]) => {
  const uniqueNames = [...new Set(names)];
  await model.createMany({
    data: uniqueNames.map(name => ({ name })),
    skipDuplicates: true,
  });
  return model.findMany({
    where: { name: { in: uniqueNames } },
  });
};

// Helper para obtener los objetos completos (con ID) de las entradas por nombre
const getEntriesByNames = (entries: { id: string; name: string }[], names: string[]) => {
  const nameToEntryMap = new Map(entries.map(e => [e.name, e]));
  return names.map(name => nameToEntryMap.get(name)!).filter(Boolean);
};

async function main() {
  console.log(`Start seeding ...`);

  // --- 1. Limpieza Total ---
  await prisma.callRecord.deleteMany({});
  await prisma.user.deleteMany({ where: { email: { not: 'admin@crucianelli.com' } } });
  await prisma.businessUnit.deleteMany({});
  await prisma.$transaction([
    prisma.callerType.deleteMany(),
    prisma.machineType.deleteMany(),
    prisma.dealership.deleteMany(),
    prisma.inquiryArea.deleteMany(),
    prisma.responseReason.deleteMany(),
    prisma.contactChannel.deleteMany(),
    prisma.durationRange.deleteMany(),
    prisma.urgencyLevel.deleteMany(),
    prisma.leafProductType.deleteMany(),
    prisma.fertecMachineType.deleteMany(),
    prisma.complaintLocation.deleteMany(),
  ]);
  console.log('Old data deleted.');

  // --- 2. Crear Entidades Principales ---
  const crucianelli = await prisma.businessUnit.create({ data: { name: 'Crucianelli' } });
  const leaf = await prisma.businessUnit.create({ data: { name: 'Leaf' } });
  const fertec = await prisma.businessUnit.create({ data: { name: 'Fertec' } });
  console.log('Business units created.');

  // --- 3. Definir, Crear y RECUPERAR TODAS las opciones de catálogos ---
  const crucianelliFertecCallerTypesNames = ['Concesionario', 'Mecánico de fábrica', 'Comercial de fábrica', 'Cliente', 'Otro'];
  const leafCallerTypesNames = [...crucianelliFertecCallerTypesNames, 'Técnico externo'];
  const allCallerTypes = await createUniqueEntries(prisma.callerType, [...crucianelliFertecCallerTypesNames, ...leafCallerTypesNames]);

  const crucianelliMachineTypesNames = ['Gringa', 'Pionera', 'Drilor', 'Plantor', 'Mixia', 'Domina'];
  const allCrucianelliMachineTypes = await createUniqueEntries(prisma.machineType, crucianelliMachineTypesNames);
  
  const fertecMachineTypesNames = ['Fertilizadora de arrastre', 'Fertilizadora Autopropulsada', 'Incorporadora', 'Semi remolque'];
  const allFertecMachineTypes = await createUniqueEntries(prisma.fertecMachineType, fertecMachineTypesNames);
  
  const leafProductTypesNames = ['Orizon', 'Piloto Automático', 'Orion', 'Smart Press', 'Dosificador', 'Dosify', 'Deep Agro'];
  const allLeafProductTypes = await createUniqueEntries(prisma.leafProductType, leafProductTypesNames);

  const allDealershipsNames = ["Agrícola Arrecifes", "Agrícola Noroeste", "Agrícola Rafaela S.A.", "Agro de Souza S.A.", "Agro Scheidegger", "Agro Sur S.A.C.I.F.I.A.", "Agrocomercial Chivilcoy", "Agromaq Saladillo S.R.L.", "Alonso Maquinarias", "Altamirano Oscar A. Maquinaria", "Álvarez Maquinarias", "Anta Maquinarias S.R.L.", "Botto Víctor", "Calatroni Javier", "Caminiti Caminos", "Caon Maquinarias", "Castagno y Priotti S.A.S.", "Centeno maquinarias", "Ciagro", "Combes Gabriel", "Corporacion de Máquinaria Sa", "Cosechar S.A.", "Cri - Mag", "Criolani", "Depetris", "Distribuidora Z", "Echevarria", "El Marrullero", "EQ S.A.", "Ferrari maquinarias", "Frare Hernán", "Gondra", "Guerrero Carlos", "Implementos Quadri SRL", "Lanzetti", "Litoral Comercial S.A", "Luciano Salvador", "Luis S Ferro", "M.F.M. Rural S.R.L", "Maquiagro (Moralejo)", "Máquinas del Centro", "Maratta maquinarias", "Net Multiagro SRL", "Pajín maquinarias S.A", "Pallotti Diego", "Perracino", "Perticarini", "Pintucci y Gûizzo", "Pozzi Maquinarias", "Realicó Agrosoluciones (RAS)", "Sabbione", "Schmidt Mauricio", "Silvia Lombardi", "Silvio Quevedo", "Spitale Osvaldo", "Sur Pampa S.A.(Uribe)", "Taborro Omar", "Tecnomac", "Todo Campo (Salum)", "Vagliengo Maquinarias", "Weinbaur", "Wirz Carlos", "Zappelli"];
  const leafDealershipsNames = ["Agrícola Arrecifes", "Agrícola Noroeste", "Agrícola Rafaela S.A.", "Agro de Souza S.A.", "Agro Scheidegger"];
  const allDealerships = await createUniqueEntries(prisma.dealership, allDealershipsNames);
  
  const crucianelliInquiryAreasNames = ['Accesorios', 'Chasis', 'Cuchillas, Discos', 'Cuerpo de siembra', 'Dosificador de fertilizante', 'Dosificador de semillas', 'Equipo hidráulico', 'Lanza', 'Leaf', 'Mando de siembra y fertilizacion mecánico', 'Marcadores', 'Medios de accesos a tolvas', 'Precision Planting', 'Sistema de aspiración', 'Sistema de sustentación', 'Sistema de transporte semilla - fertilizante', 'Tolvas'];
  const fertecInquiryAreasNames = ['Accesorios', 'Chasis', 'Cuchillas, Discos', 'Cuerpo fertilizador', 'Dosificador de fertilizante', 'Equipo hidráulico', 'Lanza', 'Leaf', 'Mando de fertilización mecánico', 'Medios de accesos a tolvas', 'Sistema de sustentación', 'Sistema de transporte de fertilizante', 'Tolvas', 'Cuffia', 'Platos de distribución'];
  const leafInquiryAreasNames = ['Cableado', 'Controlador', 'ECU de control', 'Sensores', 'Software / Configuración', 'Fuente de alimentación', 'Actualización de software', 'Comunicación entre módulos', 'Unidad de control hidráulico', 'Base de datos', 'Otro'];
  const allInquiryAreas = await createUniqueEntries(prisma.inquiryArea, [...new Set([...crucianelliInquiryAreasNames, ...fertecInquiryAreasNames, ...leafInquiryAreasNames])]);

  const crucianelliFertecResponseReasonsNames = ['Falla, reemplazo o envío de componente Electronico', 'Falla, reemplazo o envío de componente Hidraulico', 'Falla, reemplazo o envío de componente Mecánico', 'Asistencia configuración', 'Asistencia regulación', 'Respuesta técnica Electronica', 'Respuesta técnica Hidraulica', 'Respuesta técnica Mecánica'];
  const leafResponseReasonsNames = ['Falla, reemplazo o envío de componente electrónico', 'Asistencia en configuración inicial', 'Asistencia en diagnóstico de fallas', 'Solicitud de actualización de software', 'Consulta sobre compatibilidad', 'Consulta sobre uso o funcionalidades', 'Respuesta técnica electrónica', 'Derivación a soporte especializado'];
  const allResponseReasons = await createUniqueEntries(prisma.responseReason, [...new Set([...crucianelliFertecResponseReasonsNames, ...leafResponseReasonsNames])]);
  
  const crucianelliFertecContactChannelsNames = ['Telefónico', 'WhatsApp'];
  const leafContactChannelsNames = ['Telefónico', 'WhatsApp', 'Videollamada'];
  const allContactChannels = await createUniqueEntries(prisma.contactChannel, [...new Set([...crucianelliFertecContactChannelsNames, ...leafContactChannelsNames])]);

  const crucianelliFertecDurationRangesNames = ['Menos de 5 minutos (Llamadas)', 'Entre 5 y 10 minutos (Llamadas)', 'Entre 10 y 20 minutos (Llamadas)', 'Entre 20 y 35 minutos (Llamadas)', 'Entre 35 y 60 minutos (Llamadas)', 'Mas de 1 hora (Llamadas)', 'Menos de 5 minutos (Whatsapp corto)', 'Entre 5 y 15 minutos (Whatsapp medio)', 'Entre 15 y 60 minutos (Whatsapp largo)'];
  const leafDurationRangesNames = ['Menos de 5 minutos', 'Entre 5 y 10 minutos', 'Entre 10 y 20 minutos', 'Entre 20 y 35 minutos', 'Entre 35 y 60 minutos', 'Más de 1 hora', 'Mensaje breve (menos de 5 minutos)', 'Mensaje técnico medio (5-15 minutos)', 'Mensaje largo o múltiples intercambios (15-60 minutos)'];
  const allDurationRanges = await createUniqueEntries(prisma.durationRange, [...new Set([...crucianelliFertecDurationRangesNames, ...leafDurationRangesNames])]);

  const crucianelliFertecUrgencyLevelsNames = ['Urgente', 'No urgente'];
  const leafUrgencyLevelsNames = ['Urgente (impide uso del sistema)', 'No urgente (consulta o configuración)'];
  const allUrgencyLevels = await createUniqueEntries(prisma.urgencyLevel, [...new Set([...crucianelliFertecUrgencyLevelsNames, ...leafUrgencyLevelsNames])]);
  
  console.log('All catalog options created and fetched.');

  // --- 4. Conectar catálogos a Unidades de Negocio usando IDs explícitos ---
  await prisma.businessUnit.update({ where: { id: crucianelli.id }, data: {
    callerTypes:      { connect: getEntriesByNames(allCallerTypes, crucianelliFertecCallerTypesNames) },
    machineTypes:     { connect: getEntriesByNames(allCrucianelliMachineTypes, crucianelliMachineTypesNames) },
    dealerships:      { connect: getEntriesByNames(allDealerships, allDealershipsNames) },
    inquiryAreas:     { connect: getEntriesByNames(allInquiryAreas, crucianelliInquiryAreasNames) },
    responseReasons:  { connect: getEntriesByNames(allResponseReasons, crucianelliFertecResponseReasonsNames) },
    contactChannels:  { connect: getEntriesByNames(allContactChannels, crucianelliFertecContactChannelsNames) },
    durationRanges:   { connect: getEntriesByNames(allDurationRanges, crucianelliFertecDurationRangesNames) },
    urgencyLevels:    { connect: getEntriesByNames(allUrgencyLevels, crucianelliFertecUrgencyLevelsNames) },
  }});

  await prisma.businessUnit.update({ where: { id: leaf.id }, data: {
    callerTypes:      { connect: getEntriesByNames(allCallerTypes, leafCallerTypesNames) },
    leafProductTypes: { connect: getEntriesByNames(allLeafProductTypes, leafProductTypesNames) },
    dealerships:      { connect: getEntriesByNames(allDealerships, leafDealershipsNames) },
    inquiryAreas:     { connect: getEntriesByNames(allInquiryAreas, leafInquiryAreasNames) },
    responseReasons:  { connect: getEntriesByNames(allResponseReasons, leafResponseReasonsNames) },
    contactChannels:  { connect: getEntriesByNames(allContactChannels, leafContactChannelsNames) },
    durationRanges:   { connect: getEntriesByNames(allDurationRanges, leafDurationRangesNames) },
    urgencyLevels:    { connect: getEntriesByNames(allUrgencyLevels, leafUrgencyLevelsNames) },
  }});

  await prisma.businessUnit.update({ where: { id: fertec.id }, data: {
    callerTypes:        { connect: getEntriesByNames(allCallerTypes, crucianelliFertecCallerTypesNames) },
    fertecMachineTypes: { connect: getEntriesByNames(allFertecMachineTypes, fertecMachineTypesNames) },
    dealerships:        { connect: getEntriesByNames(allDealerships, allDealershipsNames) },
    inquiryAreas:       { connect: getEntriesByNames(allInquiryAreas, fertecInquiryAreasNames) },
    responseReasons:    { connect: getEntriesByNames(allResponseReasons, crucianelliFertecResponseReasonsNames) },
    contactChannels:    { connect: getEntriesByNames(allContactChannels, crucianelliFertecContactChannelsNames) },
    durationRanges:     { connect: getEntriesByNames(allDurationRanges, crucianelliFertecDurationRangesNames) },
    urgencyLevels:      { connect: getEntriesByNames(allUrgencyLevels, crucianelliFertecUrgencyLevelsNames) },
  }});
  console.log('Catalogs connected to business units.');

  // --- 5. Crear usuario admin si no existe ---
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@crucianelli.com' } });
  if (!adminUser) {
    const saltRounds = 10;
    const plainPassword = 'admin';
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    await prisma.user.create({
      data: { name: 'Administrador', email: 'admin@crucianelli.com', password: hashedPassword, role: 'ADMIN' },
    });
    console.log('Admin user created.');
  } else {
    console.log('Admin user already exists.');
  }

  console.log(`Seeding finished.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});