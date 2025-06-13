import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService], // ¡Importante! Exportamos el servicio para que sea reutilizable.
})
export class UsersModule {}
