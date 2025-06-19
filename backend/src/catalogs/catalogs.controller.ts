// backend/src/catalogs/catalogs.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  // Función de ayuda para construir la cláusula de filtro para Prisma
  private getFindAllOptions(query: { businessUnitId?: string }) {
    if (query.businessUnitId) {
      return { where: { businessUnits: { some: { id: query.businessUnitId } } } };
    }
    return undefined;
  }

  @Get('business-units')
  findAllBusinessUnits() { return this.catalogsService.findAllBusinessUnits(); }

  @Get('caller-types')
  findAllCallerTypes(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllCallerTypes(this.getFindAllOptions(query)); }

  @Get('machine-types')
  findAllMachineTypes(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllMachineTypes(this.getFindAllOptions(query)); }

  @Get('dealerships')
  findAllDealerships(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllDealerships(this.getFindAllOptions(query)); }

  @Get('inquiry-areas')
  findAllInquiryAreas(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllInquiryAreas(this.getFindAllOptions(query)); }

  @Get('response-reasons')
  findAllResponseReasons(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllResponseReasons(this.getFindAllOptions(query)); }

  @Get('contact-channels')
  findAllContactChannels(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllContactChannels(this.getFindAllOptions(query)); }

  @Get('duration-ranges')
  findAllDurationRanges(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllDurationRanges(this.getFindAllOptions(query)); }

  @Get('urgency-levels')
  findAllUrgencyLevels(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllUrgencyLevels(this.getFindAllOptions(query)); }

  @Get('leaf-product-types')
  findAllLeafProductTypes(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllLeafProductTypes(this.getFindAllOptions(query)); }

  @Get('complaint-locations')
  findAllComplaintLocations(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllComplaintLocations(this.getFindAllOptions(query)); }
  
  @Get('fertec-machine-types')
  findAllFertecMachineTypes(@Query() query: { businessUnitId?: string }) { return this.catalogsService.findAllFertecMachineTypes(this.getFindAllOptions(query)); }
}