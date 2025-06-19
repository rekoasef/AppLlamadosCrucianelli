// backend/src/catalogs/catalogs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogsService {
  constructor(private prisma: PrismaService) {}

  // Función de ayuda para añadir siempre un ordenamiento y aceptar filtros opcionales
  private createOptions(options?: { where: any }): any {
    const queryOptions: any = { orderBy: { name: 'asc' } };
    if (options && options.where) {
      queryOptions.where = options.where;
    }
    return queryOptions;
  }

  findAllBusinessUnits() { return this.prisma.businessUnit.findMany({ orderBy: { name: 'asc' } }); }
  findAllCallerTypes(options?: any) { return this.prisma.callerType.findMany(this.createOptions(options)); }
  findAllMachineTypes(options?: any) { return this.prisma.machineType.findMany(this.createOptions(options)); }
  findAllDealerships(options?: any) { return this.prisma.dealership.findMany(this.createOptions(options)); }
  findAllInquiryAreas(options?: any) { return this.prisma.inquiryArea.findMany(this.createOptions(options)); }
  findAllResponseReasons(options?: any) { return this.prisma.responseReason.findMany(this.createOptions(options)); }
  findAllContactChannels(options?: any) { return this.prisma.contactChannel.findMany(this.createOptions(options)); }
  findAllDurationRanges(options?: any) { return this.prisma.durationRange.findMany(this.createOptions(options)); }
  findAllUrgencyLevels(options?: any) { return this.prisma.urgencyLevel.findMany(this.createOptions(options)); }
  findAllLeafProductTypes(options?: any) { return this.prisma.leafProductType.findMany(this.createOptions(options)); }
  findAllComplaintLocations(options?: any) { return this.prisma.complaintLocation.findMany(this.createOptions(options)); }
  findAllFertecMachineTypes(options?: any) { return this.prisma.fertecMachineType.findMany(this.createOptions(options)); }
}