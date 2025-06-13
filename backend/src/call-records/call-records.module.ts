import { Module } from '@nestjs/common';
import { CallRecordsService } from './call-records.service';
import { CallRecordsController } from './call-records.controller';

@Module({
  controllers: [CallRecordsController],
  providers: [CallRecordsService],
})
export class CallRecordsModule {}
