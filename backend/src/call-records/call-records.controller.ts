import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CallRecordsService } from './call-records.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('call-records')
export class CallRecordsController {
  constructor(private readonly callRecordsService: CallRecordsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCallRecordDto: CreateCallRecordDto, @Request() req) {
    const userId = req.user.userId;
    return this.callRecordsService.create(createCallRecordDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.callRecordsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callRecordsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallRecordDto: UpdateCallRecordDto) {
    return this.callRecordsService.update(id, updateCallRecordDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.callRecordsService.remove(id);
  }
}
