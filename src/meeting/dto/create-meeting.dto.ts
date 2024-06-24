import { IsArray, IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  id_employee: number[];

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

  @IsNotEmpty()
  @IsString()
  link_meeting: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}