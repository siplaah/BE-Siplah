import { IsArray, IsEnum, IsInt, IsNumber, IsPositive, ValidateNested } from "class-validator";
import { typeAssessment } from "@prisma/client";
import { Type } from 'class-transformer';

class AssessmentDto {
  @IsInt()
  id_key_result: number;

  @IsEnum(typeAssessment)
  type: typeAssessment;

  @IsNumber()
  @IsPositive()
  realisasi: number;
}

export class CreateAssessmentDto {
  @IsInt()
  id_employee: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssessmentDto)
  assessment: AssessmentDto[];
}
