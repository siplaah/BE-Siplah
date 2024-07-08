import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreatePresensiDto {
  // @IsOptional()
  // @IsDateString()
  // date: Date;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsOptional()
  @IsString()
  end_time: string;

  // @Transform(({ value }) => new Date(value))
  // date: Date;

  @Transform(({ value }) => new Date(value).toISOString().split('T')[0])
  date: Date;

}
