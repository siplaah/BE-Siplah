/* eslint-disable prettier/prettier */
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

import { Jabatan, JenisKelamin, Keterangan, Pendidikan, StatusKaryawan } from '@prisma/client';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    name?: string;
    email?: string;
    alamat?: string;
    gender?: JenisKelamin;
    pendidikan?: Pendidikan;
    tanggal_lahir?: Date;
    tempat_lahir?: string;
    keterangan?: Keterangan;
    deskripsi?: StatusKaryawan;
    start_working?: Date;
    cuti?: number;
    id_jabatan?: Jabatan;

}
