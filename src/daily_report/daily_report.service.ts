import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDailyReportDto } from './dto/create-daily_report.dto';
import { UpdateDailyReportDto } from './dto/update-daily_report.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DailyReportService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDailyReportDto: CreateDailyReportDto,
    id_employee: number,
  ) {
    if (!id_employee) {
      throw new BadRequestException('Employee ID is required');
    }
    try {
      const date = new Date(createDailyReportDto.date);

      const tambahDailyReport = await this.prisma.dailyReport.create({
        data: {
          id_employee: id_employee,
          date: date.toISOString(),
          task: createDailyReportDto.task,
          status: createDailyReportDto.status,
          link: createDailyReportDto.link,
          id_project: createDailyReportDto.id_project,
        },
      });
      return tambahDailyReport;
    } catch (error) {
      console.error('Error creating overtime:', error);
      throw new BadRequestException('Gagal menambahkan pengajuan');
    }
  }

  async findAll() {
    return await this.prisma.dailyReport.findMany();
  }

  async findOne(getDailyReportbyId: Prisma.DailyReportWhereUniqueInput) {
    const getDailyReport = await this.prisma.dailyReport.findUnique({
      where: getDailyReportbyId,
    });

    if (!getDailyReport) {
      throw new BadRequestException('data tidak ditemukan');
    }
    return getDailyReport;
  }

  async update(
    where: Prisma.DailyReportWhereUniqueInput,
    data: Prisma.DailyReportUpdateInput,
  ) {
    try {
      const daily_report = await this.prisma.dailyReport.findUnique({
        where,
      });

      if (!daily_report) throw new Error('Data daily report tidak ditemukan');

      const updated = await this.prisma.dailyReport.update({
        where,
        data,
      });
      return { message: 'Data daily report berhasil diedit', data: updated };
    } catch (error) {
      throw new BadRequestException('Gagal mengedit data daily report');
    }
  }

  async remove(id: number) {
    try {
      const daily_report = await this.prisma.dailyReport.findUnique({
        where: {
          id_daily_report: id,
        },
      });
      if (!daily_report) throw new Error('Data daily report tidak ditemukan');
      await this.prisma.dailyReport.delete({
        where: {
          id_daily_report: id,
        },
      });
      return { message: 'Data karyawan berhasil dihapus', data: null };
    } catch (error) {
      throw new BadRequestException('Gagal menghapus data karyawan');
    }
  }
}
