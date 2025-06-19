import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateCallRecordDto {
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
  
  // --- CORRECCIÓN ---
  // Revertimos a @IsNotEmpty los campos que son relaciones obligatorias en la DB
  // para asegurar la integridad de los datos.

  @IsString()
  @IsNotEmpty()
  callerTypeId: string;
  
  @IsString()
  @IsOptional() // Este puede ser opcional
  machineTypeId?: string;

  @IsString()
  @IsOptional() // Este puede ser opcional
  dealershipId?: string;

  @IsString()
  @IsNotEmpty()
  inquiryAreaId: string;

  @IsString()
  @IsOptional() // Este puede ser opcional
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

  // --- Campos que sí son siempre obligatorios ---
  @IsString()
  @IsNotEmpty()
  businessUnitId: string;

  @IsObject()
  @IsOptional()
  specificData?: any;
}
