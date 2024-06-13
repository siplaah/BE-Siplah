import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsInt()
  id_employee: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @IsNotEmpty()
  @IsDateString()
  end_time: string;

  @IsNotEmpty()
  @IsString()
  link_meeting: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
