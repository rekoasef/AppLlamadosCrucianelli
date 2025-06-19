import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CallRecordsModule } from './call-records/call-records.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExportModule } from './export/export.module'; // 1. Importar el nuevo módulo

@Module({
  imports: [
    PrismaModule,
    CatalogsModule,
    AuthModule,
    UsersModule,
    CallRecordsModule,
    DashboardModule,
    ExportModule, // 2. Añadirlo a la lista de imports
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
