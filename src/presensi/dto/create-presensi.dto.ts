import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreatePresensiDto {
  @IsNotEmpty()
  @IsDateString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

}
