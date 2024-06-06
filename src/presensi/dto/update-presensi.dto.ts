import { PartialType } from '@nestjs/mapped-types';
import { CreatePresensiDto } from './create-presensi.dto';

export class UpdatePresensiDto extends PartialType(CreatePresensiDto) {}
