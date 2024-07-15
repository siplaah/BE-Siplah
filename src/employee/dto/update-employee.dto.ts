import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsDateString, IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Jabatan, JenisKelamin, Keterangan, Pendidikan, StatusKaryawan } from '@prisma/client';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @IsString()
    @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @IsString()
  alamat: string;

  @IsOptional()
  @IsEnum(JenisKelamin, { message: 'Jenis Kelamin tidak valid' })
  gender: JenisKelamin;

  @IsOptional()
  @IsEnum(Pendidikan, { message: 'Pendidikan tidak valid' })
  pendidikan: Pendidikan;

  @IsOptional()
  @IsDateString()
  tanggal_lahir: string;

  @IsOptional()
  @IsString()
  tempat_lahir: string;

  @IsOptional()
  @IsDateString()
  start_working: string;

  @IsOptional()
  @IsEnum(Keterangan, { message: 'Keterangan tidak valid' })
  keterangan: Keterangan;

  @IsOptional()
  @IsEnum(StatusKaryawan)
  deskripsi: StatusKaryawan;

  @IsNumber()
  id_jabatan: Jabatan;
}
