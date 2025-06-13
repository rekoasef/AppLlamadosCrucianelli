import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';

@Injectable()
export class CallRecordsService {
  constructor(private prisma: PrismaService) {}

  create(createCallRecordDto: CreateCallRecordDto, userId: string) {
    // Usamos el cliente de Prisma para crear el nuevo registro.
    // Además de los datos del DTO, añadimos el `handledById` para saber
    // qué usuario del call center creó el registro.
    return this.prisma.callRecord.create({
      data: {
        ...createCallRecordDto,
        handledById: userId,
      },
    });
  }
}
