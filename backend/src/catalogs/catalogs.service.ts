import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CatalogsService {
  constructor(private prisma: PrismaService) {}

  findAllBusinessUnits() { return this.prisma.businessUnit.findMany(); }
  findAllCallerTypes() { return this.prisma.callerType.findMany(); }
  findAllMachineTypes() { return this.prisma.machineType.findMany(); }
  findAllDealerships() { return this.prisma.dealership.findMany(); }
  findAllInquiryAreas() { return this.prisma.inquiryArea.findMany(); }
  findAllResponseReasons() { return this.prisma.responseReason.findMany(); }
  findAllContactChannels() { return this.prisma.contactChannel.findMany(); }
  findAllDurationRanges() { return this.prisma.durationRange.findMany(); }
  findAllUrgencyLevels() { return this.prisma.urgencyLevel.findMany(); }
  findAllLeafProductTypes() { return this.prisma.leafProductType.findMany(); }
  findAllComplaintLocations() { return this.prisma.complaintLocation.findMany(); }
  
  // --- NUEVO MÉTODO PARA FERTEC ---
  findAllFertecMachineTypes() {
    return this.prisma.fertecMachineType.findMany();
  }
}
