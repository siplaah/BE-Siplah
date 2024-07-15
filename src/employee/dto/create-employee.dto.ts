import { Jabatan, JenisKelamin, Keterangan, Pendidikan, StatusKaryawan} from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsString, IsDateString, IsNotEmpty, IsNumber, IsOptional} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
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


