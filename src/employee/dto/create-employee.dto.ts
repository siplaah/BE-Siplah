import { Jabatan, JenisKelamin, Keterangan, Pendidikan, StatusKaryawan} from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsString, IsDateString, IsNotEmpty, IsNumber} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  alamat: string;

  @IsEnum(JenisKelamin, { message: 'Jenis Kelamin tidak valid' })
  gender: JenisKelamin;

  @IsEnum(Pendidikan, { message: 'Pendidikan tidak valid' })
  pendidikan: Pendidikan;

  @IsNotEmpty()
  @IsDateString()
  tanggal_lahir: Date;

  @IsString()
  tempat_lahir: string;

  @IsNotEmpty()
  @IsDateString()
  start_working: Date;

  @IsEnum(Keterangan, { message: 'Keterangan tidak valid' })
  keterangan: Keterangan;

  @IsNotEmpty()
  @IsEnum(StatusKaryawan)
  deskripsi: StatusKaryawan;

  @IsNumber()
  id_jabatan: Jabatan;

}


