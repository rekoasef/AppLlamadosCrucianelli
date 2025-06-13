import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CallRecordsModule } from './call-records/call-records.module';


@Module({
  imports: [
    PrismaModule,
    CatalogsModule,
    AuthModule, // <-- Módulo de autenticación
    UsersModule,  // <-- Módulo de usuarios
    CallRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
