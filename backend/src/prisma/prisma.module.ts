import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ¡Importante! Hace que este módulo esté disponible en toda la app sin tener que importarlo en todos lados.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exportamos el servicio para que otros módulos puedan usarlo.
})
export class PrismaModule {}
