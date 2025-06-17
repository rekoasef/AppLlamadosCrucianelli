import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';

@Injectable()
export class CallRecordsService {
  constructor(private prisma: PrismaService) {}

  create(createCallRecordDto: CreateCallRecordDto, userId: string) {
    return this.prisma.callRecord.create({
      data: {
        ...createCallRecordDto,
        createdById: userId,
      },
    });
  }

  findAll() {
    // ... (código existente)
    return this.prisma.callRecord.findMany({
      include: {
        callerType: { select: { name: true } },
        dealership: { select: { name: true } },
        urgencyLevel: { select: { name: true } },
        createdByUser: { select: { name: true } },
        handledBy: { select: { name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    // ... (código existente)
    const record = await this.prisma.callRecord.findUnique({
      where: { id },
      include: {
        callerType: true,
        machineType: true,
        dealership: true,
        inquiryArea: true,
        responseReason: true,
        contactChannel: true,
        durationRange: true,
        urgencyLevel: true,
        createdByUser: { select: { name: true, email: true } },
        handledBy: { select: { name: true, email: true } },
      },
    });

    if (!record) {
      throw new NotFoundException(`Registro con ID "${id}" no encontrado.`);
    }
    return record;
  }
  
  async update(id: string, updateCallRecordDto: UpdateCallRecordDto) {
    // ... (código existente)
    await this.findOne(id); 
    
    return this.prisma.callRecord.update({
      where: { id },
      data: updateCallRecordDto,
    });
  }

  // --- NUEVO MÉTODO ---
  async remove(id: string) {
    // Nos aseguramos de que el registro exista antes de intentar borrarlo.
    // findOne lanzará un error 404 si no lo encuentra.
    await this.findOne(id);

    // Usamos prisma.delete para eliminar el registro.
    return this.prisma.callRecord.delete({
      where: { id },
    });
  }
}
