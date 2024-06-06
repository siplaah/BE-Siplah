
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePresensiDto {
    @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'format start_date harus DD-MM-YYYY',
  })
  date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'format start_time harus HH:MM' })
  start_time: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'format end_time harus HH:MM' })
  end_time: string;

}
