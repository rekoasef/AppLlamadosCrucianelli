import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get('business-units')
  findAllBusinessUnits() { return this.catalogsService.findAllBusinessUnits(); }
  @Get('caller-types')
  findAllCallerTypes() { return this.catalogsService.findAllCallerTypes(); }
  @Get('machine-types')
  findAllMachineTypes() { return this.catalogsService.findAllMachineTypes(); }
  @Get('dealerships')
  findAllDealerships() { return this.catalogsService.findAllDealerships(); }
  @Get('inquiry-areas')
  findAllInquiryAreas() { return this.catalogsService.findAllInquiryAreas(); }
  @Get('response-reasons')
  findAllResponseReasons() { return this.catalogsService.findAllResponseReasons(); }
  @Get('contact-channels')
  findAllContactChannels() { return this.catalogsService.findAllContactChannels(); }
  @Get('duration-ranges')
  findAllDurationRanges() { return this.catalogsService.findAllDurationRanges(); }
  @Get('urgency-levels')
  findAllUrgencyLevels() { return this.catalogsService.findAllUrgencyLevels(); }
  @Get('leaf-product-types')
  findAllLeafProductTypes() { return this.catalogsService.findAllLeafProductTypes(); }
  @Get('complaint-locations')
  findAllComplaintLocations() { return this.catalogsService.findAllComplaintLocations(); }

  // --- NUEVO ENDPOINT PARA FERTEC ---
  @Get('fertec-machine-types')
  findAllFertecMachineTypes() {
    return this.catalogsService.findAllFertecMachineTypes();
  }
}
