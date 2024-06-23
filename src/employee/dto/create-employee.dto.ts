import { Jabatan, Keterangan, Pendidikan } from '@prisma/client';
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


  @IsNumber()
  id_jabatan: Jabatan;

}


