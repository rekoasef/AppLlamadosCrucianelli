import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CallRecordsService } from './call-records.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('call-records')
export class CallRecordsController {
  constructor(private readonly callRecordsService: CallRecordsService) {}

  @UseGuards(AuthGuard('jwt')) // ¡Protegemos la ruta!
  @Post()
  create(@Body() createCallRecordDto: CreateCallRecordDto, @Request() req) {
    // Obtenemos el ID del usuario desde el token (que el AuthGuard ya validó)
    const userId = req.user.userId;
    return this.callRecordsService.create(createCallRecordDto, userId);
  }
}
