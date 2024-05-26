import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
// import { CreateOvertimeDto } from './dto/create-overtime.dto';
// import * as moment from 'moment';

@Injectable()
export class OvertimeService {
  constructor(private prisma: PrismaService) {}

  async create(createOvertime: Prisma.OvertimesCreateInput) {
    try {
      const tambahOvertime = await this.prisma.overtimes.create({
        data: createOvertime,
      });
      return tambahOvertime;
    } catch (error) {
      throw new BadRequestException('Gagal menambahkan pengajuan');
    }
  }

  findAll() {
    return this.prisma.overtimes.findMany();
  }

  async findOne(getOvertimebyId: Prisma.OvertimesWhereUniqueInput) {
    const getOvertime = await this.prisma.overtimes.findUnique({
      where: getOvertimebyId,
    });

    if (!getOvertime) {
      throw new BadRequestException('data tidak ditemukan');
    }

    return getOvertime;
  }

  async update(
    where: Prisma.OvertimesWhereUniqueInput,
    data: Prisma.OvertimesUpdateInput,
  ) {
    try {
      const updateOvertime = await this.prisma.overtimes.update({
        where,
        data,
      });
      return {
        message: 'Pengajuan berhasil di update',
        overtime: updateOvertime,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleteOvertime = await this.prisma.overtimes.delete({
        where: { id_overtime: id },
      });
      if (!deleteOvertime) {
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }
      return { message: 'Pengajuan berhasil dihapus' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }
      throw error;
    }
  }

  async approve(id: number) {
    return this.prisma.overtimes.update({
      where: { id_overtime: id },
      data: { status: 'approved' },
    });
  }

  async reject(id: number) {
    return this.prisma.overtimes.update({
      where: { id_overtime: id },
      data: { status: 'rejected' },
    });
  }
}
