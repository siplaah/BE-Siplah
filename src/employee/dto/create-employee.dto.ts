import { Keterangan, Pendidikan } from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  alamat: string;

  @IsEnum(Pendidikan, { message: 'Pendidikan tidak valid' })
  pendidikan: Pendidikan;

  @IsDate()
  tanggal_lahir: Date;

  @IsString()
  tempat_lahir: string;

  @IsEnum(Keterangan, { message: 'Keterangan tidak valid' })
  keterangan: Keterangan;
}
