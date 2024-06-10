import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeOffDto } from './create-time_off.dto';

export class UpdateTimeOffDto extends PartialType(CreateTimeOffDto) {}
