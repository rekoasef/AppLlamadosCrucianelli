import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Prisma } from '@prisma/client';

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

  async findAll(queryParams: QueryParamsDto) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const { search, status, urgencyLevelId, dealershipId } = queryParams;
    const skip = (page - 1) * limit;

    const where: Prisma.CallRecordWhereInput = {};

    if (search) {
      where.OR = [
        { contactName: { contains: search, mode: 'insensitive' } },
        { machineSerialNumber: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.status = status;
    }
    if (urgencyLevelId) {
      where.urgencyLevelId = urgencyLevelId;
    }
    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    const [records, total] = await this.prisma.$transaction([
      this.prisma.callRecord.findMany({
        where,
        skip,
        take: limit,
        include: {
          callerType: { select: { name: true } },
          dealership: { select: { name: true } },
          urgencyLevel: { select: { name: true } },
          createdByUser: { select: { name: true } },
          handledBy: { select: { name: true } },
          businessUnit: { select: { name: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.callRecord.count({ where }),
    ]);

    return {
      data: records,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const record = await this.prisma.callRecord.findUnique({
      where: { id },
      include: {
        // --- ¡CAMBIO CLAVE! ---
        // Añadimos la unidad de negocio a los datos que devolvemos.
        businessUnit: true,
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
    await this.findOne(id);

    return this.prisma.callRecord.update({
      where: { id },
      data: updateCallRecordDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.callRecord.delete({
      where: { id },
    });
  }
}
