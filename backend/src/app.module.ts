// backend/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- IMPORTAMOS EL MÓDULO
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CallRecordsModule } from './call-records/call-records.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportModule } from './export/export.module';

@Module({
  imports: [
    // --- LÍNEA AÑADIDA ---
    // Esto hace que las variables del .env estén disponibles en toda la app
    ConfigModule.forRoot({ isGlobal: true }), 
    
    PrismaModule,
    UsersModule,
    AuthModule,
    CallRecordsModule,
    CatalogsModule,
    DashboardModule,
    ExportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}