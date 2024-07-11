/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
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
