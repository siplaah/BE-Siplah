import { Status } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateOvertimeDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'format start_date harus DD-MM-YYYY',
  })
  start_date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'format end_date harus DD-MM-YYYY',
  })
  end_date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'format start_time harus HH:MM' })
  start_time: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'format end_time harus HH:MM' })
  end_time: string;

  @IsString()
  @IsNotEmpty()
  attachment: string;

  @IsNotEmpty()
  @IsEnum(Status, { message: 'Status tidak valid' })
  status: Status;
}
