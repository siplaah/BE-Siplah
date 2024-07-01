import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreatePresensiDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @IsNotEmpty()
  @IsDateString()
  end_time: string;

}
