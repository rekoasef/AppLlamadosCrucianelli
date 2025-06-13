// backend/src/catalogs/catalogs.controller.ts

import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  // ENDPOINT ELIMINADO: @Get('business-units')

  @Get('caller-types')
  findCallerTypes() {
    return this.catalogsService.findAllCallerTypes();
  }

  @Get('machine-types')
  findMachineTypes() {
    return this.catalogsService.findAllMachineTypes();
  }

  @Get('dealerships')
  findDealerships() {
    return this.catalogsService.findAllDealerships();
  }

  @Get('inquiry-areas')
  findInquiryAreas() {
    return this.catalogsService.findAllInquiryAreas();
  }

  @Get('response-reasons')
  findResponseReasons() {
    return this.catalogsService.findAllResponseReasons();
  }

  @Get('contact-channels')
  findContactChannels() {
    return this.catalogsService.findAllContactChannels();
  }

  @Get('duration-ranges')
  findDurationRanges() {
    return this.catalogsService.findAllDurationRanges();
  }

  @Get('urgency-levels')
  findUrgencyLevels() {
    return this.catalogsService.findAllUrgencyLevels();
  }
}