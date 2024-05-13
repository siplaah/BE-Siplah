import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
