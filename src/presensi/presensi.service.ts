import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePresensiDto } from './dto/create-presensi.dto';
import { UpdatePresensiDto } from './dto/update-presensi.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { Presensi } from './entities/presensi.entity';

@Injectable()
export class PresensiService {
  constructor(private prisma: PrismaService) {}

  async create(createPresensiDto: CreatePresensiDto, id_employee: number) {
    if (!id_employee) {
      throw new BadRequestException('Employee ID is required');
    }
    try {
      const date = new Date(createPresensiDto.date);      
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const tambahPresensi = await this.prisma.presensi.create({
        data: {
          id_employee: id_employee,
          date: date.toISOString(),
          start_time: createPresensiDto.start_time,
          end_time: createPresensiDto.end_time,
        },
      });
      return tambahPresensi;
    } catch (error) {
      console.error('Error creating overtime:', error);
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

  async update(
    where: Prisma.PresensiWhereUniqueInput,
    updatePresensiDto: UpdatePresensiDto,
  ) {
    const presensi = await this.prisma.presensi.findUnique({
      where,
    });

    if (!presensi) {
      throw new BadRequestException('Presensi tidak ditemukan');
    }

    if (updatePresensiDto.end_time && !presensi.start_time) {
      throw new BadRequestException('Start time harus diisi sebelum end time');
    }

    const updatePresensi = await this.prisma.presensi.update({
      where,
      data: {
        start_time: updatePresensiDto.start_time,
        end_time: updatePresensiDto.end_time,
      },
    });

    return {
      message: 'Presensi berhasil di update',
      presensi: updatePresensi,
    };
  }

  async remove(id: number) {
    try {
      const deletePresensi = await this.prisma.presensi.delete({
        where: { id_presensi: id },
      });
      if (!deletePresensi) {
        throw new BadRequestException('Presensi tidak dapat ditemukan');
      }
      return { message: 'Presensi berhasil dihapus' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Presensi tidak dapat ditemukan');
      }
      throw error;
    }
  }
}
