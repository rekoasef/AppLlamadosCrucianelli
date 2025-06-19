import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ExportService } from './export.service';
import { QueryParamsDto } from 'src/call-records/dto/query-params.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('excel')
  async exportToExcel(@Query() queryParams: QueryParamsDto, @Res() res: Response) {
    const buffer = await this.exportService.exportToExcel(queryParams);

    const today = new Date().toISOString().slice(0, 10);
    const filename = `registros-llamadas-${today}.xlsx`;

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
    res.send(buffer);
  }

  // --- NUEVO ENDPOINT PARA PDF ---
  @Get('pdf')
  async exportToPdf(@Query() queryParams: QueryParamsDto, @Res() res: Response) {
    const buffer = await this.exportService.exportToPdf(queryParams);

    const today = new Date().toISOString().slice(0, 10);
    const filename = `registros-llamadas-${today}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.setHeader('Content-Type', 'application/pdf');
    
    res.send(buffer);
  }
}
