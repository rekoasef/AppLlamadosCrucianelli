import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Este método se ejecuta cuando el módulo se inicializa.
    // Nos conectamos a la base de datos.
    await this.$connect();
  }
}
