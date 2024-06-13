
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreatePresensiDto {
    @IsString()
  date: string;

  @IsString()
  start_time: string;

  @IsString()
  end_time: string;

}
