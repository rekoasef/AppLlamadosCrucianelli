import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateCallRecordDto {
  // --- Campos existentes ---
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsString()
  @IsOptional()
  machineSerialNumber?: string;
  
  @IsString()
  @IsOptional()
  observations?: string;

  @IsString()
  @IsOptional()
  billedClient?: string;

  @IsString()
  @IsNotEmpty()
  callerTypeId: string;
  
  @IsString()
  @IsOptional()
  machineTypeId?: string;

  @IsString()
  @IsOptional()
  dealershipId?: string;

  @IsString()
  @IsNotEmpty()
  inquiryAreaId: string;

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

  // --- NUEVOS CAMPOS ---
  @IsString()
  @IsNotEmpty()
  businessUnitId: string; // Ahora es obligatorio

  @IsObject() // Validamos que sea un objeto
  @IsOptional()
  specificData?: any; // Nuestro "cajón de sastre"
}
