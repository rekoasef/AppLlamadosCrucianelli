import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CallStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // Usamos 'count' para obtener el número de registros.
    // Es mucho más rápido que traer todos los registros y contarlos.
    const totalRecords = await this.prisma.callRecord.count();

    const openRecords = await this.prisma.callRecord.count({
      where: {
        status: CallStatus.OPEN, // Filtramos por el estado 'OPEN'
      },
    });

    const closedToday = await this.prisma.callRecord.count({
        where: {
            status: CallStatus.CLOSED,
            updatedAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), // 'gte' = Greater Than or Equal (mayor o igual que hoy a las 00:00)
            }
        }
    });

    // Devolvemos un objeto con todas las estadísticas.
    return {
      totalRecords,
      openRecords,
      closedToday,
    };
  }

  async getRecordsByStatus() {
    // 'groupBy' es una operación muy potente. Le pedimos a la base de datos
    // que agrupe todos los registros por el campo 'status'.
    const recordsByStatus = await this.prisma.callRecord.groupBy({
      by: ['status'], // El campo por el que queremos agrupar.
      _count: {
        id: true, // Le decimos que cuente los registros en cada grupo (usando el campo 'id').
      },
    });

    // El resultado de groupBy es un poco diferente, así que lo transformamos
    // a un formato más amigable para el frontend.
    return recordsByStatus.map(group => ({
        name: group.status,
        value: group._count.id
    }));
  }
}
