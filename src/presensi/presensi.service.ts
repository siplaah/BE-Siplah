import {  BadRequestException, Injectable } from '@nestjs/common';
import { CreatePresensiDto } from './dto/create-presensi.dto';
import { UpdatePresensiDto } from './dto/update-presensi.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PresensiService {
  constructor(private prisma: PrismaService) {}
  async create(createPresensi: Prisma.PresensiCreateInput) {
    try {
      const tambahPresensi = await this.prisma.presensi.create({
        data: createPresensi,
      });
      return tambahPresensi;
    } catch (error) {
      throw new BadRequestException('Gagal menambahkan presensi');
    }
  }

  async findAll() {
    return await this.prisma.presensi.findMany();
  }

  async findOne(getPresensibyid: Prisma.PresensiWhereUniqueInput) {
    const presensi = await this.prisma.presensi.findUnique({
      where: getPresensibyid,
    });
    if (!presensi) {
      throw new BadRequestException('data tidak ditemukan');
    }
    return presensi;
  }

}