import { PartialType } from '@nestjs/mapped-types';
import { CreateCallRecordDto } from './create-call-record.dto';

// PartialType toma todas las validaciones de CreateCallRecordDto
// y las aplica, pero marcando cada campo como opcional.
export class UpdateCallRecordDto extends PartialType(CreateCallRecordDto) {}
