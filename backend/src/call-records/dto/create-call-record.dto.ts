// backend/src/call-records/dto/create-call-record.dto.ts

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCallRecordDto {
  @IsString()
  @IsNotEmpty()
  callerTypeId: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsString()
  @IsOptional()
  machineSerialNumber?: string;

  @IsString()
  @IsOptional()
  machineTypeId?: string;

  @IsString()
  @IsOptional()
  billedClient?: string;
  
  @IsString()
  @IsOptional()
  dealershipId?: string;

  @IsString()
  @IsNotEmpty()
  inquiryAreaId: string;
  
  @IsString()
  @IsOptional()
  observations?: string;

  @IsString()
  @IsOptional()
  responseReasonId?: string;
  
  @IsString()
  @IsNotEmpty()
  contactChannelId: string;
  
  @IsString()
  @IsNotEmpty()
  durationRangeId: string;
  
  @IsString()
  @IsNotEmpty()
  urgencyLevelId: string;
}