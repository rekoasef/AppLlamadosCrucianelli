import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CallRecordsService } from './call-records.service';
import { CreateCallRecordDto } from './dto/create-call-record.dto';
import { UpdateCallRecordDto } from './dto/update-call-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryParamsDto } from './dto/query-params.dto';

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
  findAll(@Query() queryParams: QueryParamsDto) {
    return this.callRecordsService.findAll(queryParams);
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
