import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class AssessmentDto {
  @IsInt()
  id_key_result: number;

  @IsNumber()
  @IsPositive()
  realisasi: number;
}

export class CreateAssessmentDto {
  @IsInt()
  id_employee: number;

  @IsDateString()
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentDto)
  assessment: AssessmentDto[];
}
