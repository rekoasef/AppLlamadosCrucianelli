// backend/src/dashboard/dashboard.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getGeneralStats() {
    // ... (este método ya funciona y lo dejamos como está)
    const totalRecords = this.prisma.callRecord.count();
    const topDealerships = this.prisma.callRecord.groupBy({ by: ['dealershipId'], where: { dealershipId: { not: null } }, _count: { dealershipId: true }, orderBy: { _count: { dealershipId: 'desc' } }, take: 5 });
    const recordsByStatus = this.prisma.callRecord.groupBy({ by: ['status'], _count: { status: true } });
    const openRecords = this.prisma.callRecord.count({ where: { status: 'OPEN' } });
    const now = new Date();
    const closedToday = this.prisma.callRecord.count({ where: { status: 'CLOSED', updatedAt: { gte: startOfDay(now), lte: endOfDay(now) } } });
    const closedThisWeek = this.prisma.callRecord.count({ where: { status: 'CLOSED', updatedAt: { gte: startOfWeek(now), lte: endOfWeek(now) } } });
    const closedThisMonth = this.prisma.callRecord.count({ where: { status: 'CLOSED', updatedAt: { gte: startOfMonth(now), lte: endOfMonth(now) } } });
    const closedThisYear = this.prisma.callRecord.count({ where: { status: 'CLOSED', updatedAt: { gte: startOfYear(now), lte: endOfYear(now) } } });
    const recordsByCompany = this.prisma.callRecord.groupBy({ by: ['businessUnitId'], _count: { id: true } });
    
    const [ total, dealerships, statuses, open, closedStats, companyRecords ] = await Promise.all([ totalRecords, topDealerships, recordsByStatus, openRecords, Promise.all([closedToday, closedThisWeek, closedThisMonth, closedThisYear]), recordsByCompany ]);
    
    const dealershipIds = dealerships.map(d => d.dealershipId!);
    const dealershipNames = await this.prisma.dealership.findMany({ where: { id: { in: dealershipIds } } });
    const dealershipMap = new Map(dealershipNames.map(d => [d.id, d.name]));

    const companyIds = companyRecords.map(c => c.businessUnitId);
    const companyNames = await this.prisma.businessUnit.findMany({ where: { id: { in: companyIds } } });
    const companyMap = new Map(companyNames.map(c => [c.id, c.name]));

    return {
      totalRecords: total,
      topDealerships: dealerships.map(d => ({ name: dealershipMap.get(d.dealershipId!), count: d._count.dealershipId })),
      recordsByStatus: statuses.map(s => ({ status: s.status, count: s._count.status })),
      openRecords: open,
      closedRecords: { today: closedStats[0], week: closedStats[1], month: closedStats[2], year: closedStats[3] },
      recordsByCompany: companyRecords.map(c => ({ name: companyMap.get(c.businessUnitId), count: c._count?.id ?? 0 })),
    };
  }

  // --- FUNCIÓN ACTUALIZADA PARA OBTENER STATS POR EMPRESA ---
  async getCompanyStats(businessUnitId: string) {
    // Primero, verificamos que la empresa exista y obtenemos su nombre
    const businessUnit = await this.prisma.businessUnit.findUnique({ where: { id: businessUnitId } });
    if (!businessUnit) {
      throw new NotFoundException(`Business unit with ID ${businessUnitId} not found`);
    }

    const whereClause = { businessUnitId };

    // Consultas generales filtradas por empresa
    const totalRecords = this.prisma.callRecord.count({ where: whereClause });
    const openRecords = this.prisma.callRecord.count({ where: { ...whereClause, status: 'OPEN' } });
    const topDealership = this.prisma.callRecord.groupBy({ by: ['dealershipId'], where: { ...whereClause, dealershipId: { not: null } }, _count: { dealershipId: true }, orderBy: { _count: { dealershipId: 'desc' } }, take: 1 });
    const topInquiryArea = this.prisma.callRecord.groupBy({ by: ['inquiryAreaId'], where: whereClause, _count: { inquiryAreaId: true }, orderBy: { _count: { inquiryAreaId: 'desc' } }, take: 1 });
    
    // Registros cerrados con filtro de fecha
    const now = new Date();
    const closedToday = this.prisma.callRecord.count({ where: { ...whereClause, status: 'CLOSED', updatedAt: { gte: startOfDay(now), lte: endOfDay(now) } } });
    const closedThisWeek = this.prisma.callRecord.count({ where: { ...whereClause, status: 'CLOSED', updatedAt: { gte: startOfWeek(now), lte: endOfWeek(now) } } });
    const closedThisMonth = this.prisma.callRecord.count({ where: { ...whereClause, status: 'CLOSED', updatedAt: { gte: startOfMonth(now), lte: endOfMonth(now) } } });
    const closedThisYear = this.prisma.callRecord.count({ where: { ...whereClause, status: 'CLOSED', updatedAt: { gte: startOfYear(now), lte: endOfYear(now) } } });

    // Consulta de máquina con más registros (esta es la parte compleja)
    let topMachineQuery;
    if (businessUnit.name === 'Crucianelli') {
      topMachineQuery = this.prisma.callRecord.groupBy({ by: ['machineTypeId'], where: { ...whereClause, machineTypeId: { not: null } }, _count: { machineTypeId: true }, orderBy: { _count: { machineTypeId: 'desc' } }, take: 1 });
    } else if (businessUnit.name === 'Leaf') {
      topMachineQuery = this.prisma.callRecord.groupBy({ by: ['specificData'], where: whereClause, _count: { _all: true }, orderBy: { _count: { id: 'desc' } } });
       // Nota: La lógica para Leaf es más compleja por el JSON. Por ahora lo dejamos así y luego lo refinamos.
       // Lo ideal sería filtrar por specificData->>'leafProductTypeId' pero Prisma no lo soporta directamente.
       // De momento, esto es una aproximación.
    } else if (businessUnit.name === 'Fertec') {
       topMachineQuery = this.prisma.callRecord.groupBy({ by: ['specificData'], where: whereClause, _count: { _all: true }, orderBy: { _count: { id: 'desc' } } });
       // Misma nota que para Leaf, refinaremos esto después.
    }

    const [ total, open, dealership, inquiryArea, closedStats, topMachineResult ] = await Promise.all([
      totalRecords, openRecords, topDealership, topInquiryArea,
      Promise.all([closedToday, closedThisWeek, closedThisMonth, closedThisYear]),
      topMachineQuery
    ]);

    // Lógica para obtener nombres y formatear la respuesta
    const topDealershipName = dealership.length > 0 ? (await this.prisma.dealership.findUnique({ where: { id: dealership[0].dealershipId! } }))?.name : 'N/A';
    const topInquiryAreaName = inquiryArea.length > 0 ? (await this.prisma.inquiryArea.findUnique({ where: { id: inquiryArea[0].inquiryAreaId } }))?.name : 'N/A';
    
    // Simplificamos la lógica de la máquina por ahora
    let topMachineName = 'N/A';
    if (businessUnit.name === 'Crucianelli' && topMachineResult.length > 0) {
        topMachineName = (await this.prisma.machineType.findUnique({ where: { id: topMachineResult[0].machineTypeId! } }))?.name ?? 'N/A';
    }
    
    return {
      companyName: businessUnit.name,
      totalRecords: total,
      openRecords: open,
      topDealership: { name: topDealershipName, count: dealership.length > 0 ? dealership[0]._count.dealershipId : 0 },
      topInquiryArea: { name: topInquiryAreaName, count: inquiryArea.length > 0 ? inquiryArea[0]._count.inquiryAreaId : 0 },
      topMachine: { name: topMachineName, count: topMachineResult.length > 0 ? (topMachineResult[0]._count.machineTypeId ?? topMachineResult[0]._count._all) : 0 },
      closedRecords: { today: closedStats[0], week: closedStats[1], month: closedStats[2], year: closedStats[3] },
    };
  }
}