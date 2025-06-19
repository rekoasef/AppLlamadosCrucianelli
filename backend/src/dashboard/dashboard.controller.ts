// backend/src/dashboard/dashboard.controller.ts

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
// RUTA CORREGIDA: Usamos '../' para subir un nivel y luego entrar a 'auth'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // Protegemos todas las rutas del dashboard
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('general')
  getGeneralStats() {
    return this.dashboardService.getGeneralStats();
  }

  @Get('company/:businessUnitId')
  getCompanyStats(@Param('businessUnitId') businessUnitId: string) {
    return this.dashboardService.getCompanyStats(businessUnitId);
  }
}