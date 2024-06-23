import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { typeTimeOff, Status } from '@prisma/client';

export class CreateTimeOffDto {
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @IsNotEmpty()
  @IsEnum(typeTimeOff, { message: 'Type tidak valid' })
  type: typeTimeOff;

  @IsNotEmpty()
  @IsString()
  attachment: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(Status, { message: 'Status tidak valid' })
  status: Status;
}
