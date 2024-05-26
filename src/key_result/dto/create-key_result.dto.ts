import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateKeyResultDto {
  @IsNotEmpty()
  @IsString()
  key_result: string;

  @IsNotEmpty()
  @IsInt()
  target: number;
}
