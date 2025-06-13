// backend/src/call-records/call-records.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';

@Injectable()
export class CallRecordsService {
  constructor(private prisma: PrismaService) {}

  async create(createCallRecordDto: CreateCallRecordDto, userId: string) {
    // Desestructuramos el DTO, ahora sin businessUnitId
    const {
      callerTypeId,
      machineTypeId,
      dealershipId,
      inquiryAreaId,
      responseReasonId,
      contactChannelId,
      durationRangeId,
      urgencyLevelId,
      ...otherData // El resto de los campos (contactName, observations, etc.)
    } = createCallRecordDto;

    // Construimos el objeto para Prisma, ahora sin la conexión a businessUnit
    const recordData = {
      ...otherData,
      createdByUser:  { connect: { id: userId } },
      callerType:     { connect: { id: callerTypeId } },
      machineType:    machineTypeId ? { connect: { id: machineTypeId } } : undefined,
      dealership:     dealershipId ? { connect: { id: dealershipId } } : undefined,
      inquiryArea:    { connect: { id: inquiryAreaId } },
      responseReason: responseReasonId ? { connect: { id: responseReasonId } } : undefined,
      contactChannel: { connect: { id: contactChannelId } },
      durationRange:  { connect: { id: durationRangeId } },
      urgencyLevel:   { connect: { id: urgencyLevelId } },
    };

    return this.prisma.callRecord.create({
      data: recordData,
    });
  }

  findAll() {
    return `This action returns all callRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} callRecord`;
  }

  update(id: number, updateCallRecordDto: UpdateCallRecordDto) {
    return `This action updates a #${id} callRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} callRecord`;
  }
}