import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeOffDto } from './dto/create-time_off.dto';
import { UpdateTimeOffDto } from './dto/update-time_off.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Status } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class TimeOffService {
  constructor(private prisma: PrismaService) {}

  async create(
    createTimeOffDto: CreateTimeOffDto,
    file: Express.Multer.File | undefined,
    id_employee: number,
  ) {
    try {
      const startDate = new Date(createTimeOffDto.start_date);
      const endDate = new Date(createTimeOffDto.end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      let attachmentPath: string | null = null;
      if (file) {
        const { path: filePath, originalname } = file;
        attachmentPath = `uploads/${Date.now()}-${originalname}`;
        fs.renameSync(filePath, attachmentPath);
      }

      const start_date = startDate.toISOString();
      const end_date = endDate.toISOString();
      const total_hari = this.hitungTotalHari(start_date, end_date);

      if (total_hari <= 0) {
        throw new BadRequestException('Durasi cuti tidak valid');
      }

      const tambahCuti = await this.prisma.timeOff.create({
        data: {
          employee: {
            connect: {
              id_employee: id_employee,
            },
          },
          start_date: start_date,
          end_date: end_date,
          type: createTimeOffDto.type,
          attachment: attachmentPath,
          status: 'pending',
          description: createTimeOffDto.description,
        },
      });

      if (createTimeOffDto.type === 'tahunan') {
        const total_hari = this.hitungTotalHari(start_date, end_date);
        await this.jumlahCuti(id_employee, total_hari);
      }

      const employee = await this.prisma.employee.findUnique({
        where: { id_employee },
        select: { cuti: true },
      });

      return {
        message: 'Pengajuan cuti berhasil dibuat',
        overtime: tambahCuti,
        jumlah_cuti: employee.cuti,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      console.log(createTimeOffDto.start_date);
      console.error('Error creating time off request:', error);

      throw new BadRequestException(
        'Gagal menambahkan pengajuan: ' + error.message,
      );
    }
  }

  async findAll(params: {
    page: number;
    pageSize: number;
    q?: string;
    date?: string;
    id_employee?: number;
  }) {
    const { page, pageSize, q, date, id_employee } = params;

    const where: any = {};

    if (q) {
      where.employee = {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      where.start_date = {
        gte: startDate.toISOString(),
        lt: endDate.toISOString(),
      };
    }

    if (id_employee) {
      where.id_employee = Number(id_employee);
    }

    const totalData = await this.prisma.timeOff.count({ where });
    const timeOff = await this.prisma.timeOff.findMany({
      where,
      orderBy: {
        start_date: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const sortedtimeOff = timeOff.sort((a, b) => {
      const statusOrder = {
        rejected: 1,
        pending: 2,
        approved: 3,
      };

      return statusOrder[a.status] - statusOrder[b.status];
    });

    const showTotalCuti = await Promise.all(
      sortedtimeOff.map(async (timeOff) => {
        const employee = await this.prisma.employee.findUnique({
          where: { id_employee: timeOff.id_employee },
          select: { cuti: true },
        });
        return {
          ...timeOff,
          jumlah_cuti: employee?.cuti,
        };
      }),
    );

    return {
      data: showTotalCuti,
      totalData,
    };
  }

  async findOne(getTimeOffbyId: Prisma.TimeOffWhereUniqueInput) {
    try {
      const getTimeOff = await this.prisma.timeOff.findUnique({
        where: getTimeOffbyId,
      });
      return getTimeOff;
    } catch (error) {
      throw new BadRequestException('Data pengajuan tidak ditemukan', error);
    }
  }

  async update(
    where: Prisma.TimeOffWhereUniqueInput,
    updateTimeOffDto: UpdateTimeOffDto,
    file: Express.Multer.File | undefined,
  ) {
    try {
      if (
        updateTimeOffDto.status === 'rejected' &&
        !updateTimeOffDto.description
      ) {
        throw new BadRequestException(
          'Deskripsi alasan penolakan harus disertakan',
        );
      }

      let attachmentPath: string | null = null;
      if (file && file.path) {
        attachmentPath = path.basename(file.path);
      }

      const updateTimeOff = await this.prisma.timeOff.update({
        where,
        data: {
          start_date: updateTimeOffDto.start_date
            ? new Date(updateTimeOffDto.start_date).toISOString()
            : undefined,
          end_date: updateTimeOffDto.end_date
            ? new Date(updateTimeOffDto.end_date).toISOString()
            : undefined,
          attachment: attachmentPath || undefined,
          type: updateTimeOffDto.type,
          status: 'pending',
          description: updateTimeOffDto.description,
        },
      });

      if (updateTimeOffDto.status === Status.approved) {
        const total_hari = this.hitungTotalHari(
          updateTimeOff.start_date.toISOString(),
          updateTimeOff.end_date.toISOString(),
        );
        if (updateTimeOffDto.type === 'tahunan') {
          await this.jumlahCuti(updateTimeOff.id_employee, total_hari);
        }
      }

      const employee = await this.prisma.employee.findUnique({
        where: { id_employee: updateTimeOff.id_employee },
        select: { cuti: true },
      });

      return {
        message: 'Pengajuan berhasil diupdate',
        overtime: updateTimeOff,
        jumlah_cuti: employee.cuti,
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
    const getTimeOff = await this.prisma.timeOff.findUnique({
      where: { id_time_off: id },
    });

    if (!getTimeOff) {
      throw new BadRequestException('Pengajuan tidak dapat ditemukan');
    }

    if (getTimeOff.status === 'approved') {
      throw new BadRequestException(
        'Pengajuan yang sudah diapprove tidak dapat dihapus',
      );
    }

    try {
      const deleteCuti = await this.prisma.timeOff.delete({
        where: { id_time_off: id },
      });
      if (!deleteCuti) {
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
    const approvedTimeOff = await this.prisma.timeOff.update({
      where: { id_time_off: id },
      data: { status: Status.approved },
    });

    const total_hari = this.hitungTotalHari(
      approvedTimeOff.start_date.toISOString(),
      approvedTimeOff.end_date.toISOString(),
    );

    if (approvedTimeOff.type === 'tahunan') {
      await this.jumlahCuti(approvedTimeOff.id_employee, total_hari);
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id_employee: approvedTimeOff.id_employee },
      select: { cuti: true },
    });

    return {
      message: 'Pengajuan berhasil diapprove',
      overtime: approvedTimeOff,
      jumlah_cuti: employee.cuti,
    };
  }

  async reject(id_time_off: number, description: string) {
    try {
      const getTimeOff = await this.prisma.timeOff.findUnique({
        where: { id_time_off: id_time_off },
      });

      if (!getTimeOff) {
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }

      if (getTimeOff.status === 'approved') {
        throw new BadRequestException(
          'Pengajuan yang sudah diapprove tidak dapat direject',
        );
      }

      if (!description) {
        throw new BadRequestException(
          'Deskripsi alasan penolakan harus disertakan',
        );
      }

      const updateTimeOff = this.prisma.timeOff.update({
        where: { id_time_off: id_time_off },
        data: { status: 'rejected', description },
      });
      return updateTimeOff;
    } catch (error) {
      console.error('Error during update:', error);
      throw error;
    }
  }

  private hitungTotalHari(start_date: string, end_date: string): number {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const hitungWaktu = endDate.getTime() - startDate.getTime();
    const hitungHari = Math.ceil(hitungWaktu / (1000 * 3600 * 24) + 1);
    return hitungHari;
  }

  private async jumlahCuti(id_employee: number, days: number) {
    const employee = await this.prisma.employee.update({
      where: { id_employee },
      data: { cuti: { decrement: days } },
    });

    if (employee.cuti < 0) {
      await this.prisma.employee.update({
        where: { id_employee },
        data: { cuti: { increment: days } },
      });
      throw new BadRequestException('Jumlah cuti tidak mencukupi');
    }

    return employee;
  }

  async findTimeOffbyWeek() {
    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const timeOff = await this.prisma.timeOff.findMany({
        where: {
          start_date: {
            gte: today,
            lt: nextWeek,
          },
        },
        orderBy: {
          start_date: 'asc',
        },
      });

      return timeOff;
    } catch (error) {
      console.error('Error fetching next 7 days off:', error);
      throw new BadRequestException('Gagal mengambil data cuti');
    }
  }

  async exportToExcel(res: Response) {
    try {
      const data = await this.prisma.timeOff.findMany({
        include: {
          employee: true,
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Cuti');

      worksheet.columns = [
        { header: 'No', width: 10 },
        { header: 'ID Cuti', key: 'id_time_off', width: 10 },
        { header: 'ID Karyawan', key: 'id_employee', width: 15 },
        { header: 'Nama Karyawan', key: 'name_employee', width: 15 },
        { header: 'Tanggal Mulai', key: 'start_date', width: 20 },
        { header: 'Tanggal Selesai', key: 'end_date', width: 20 },
        { header: 'Tipe Cuti', key: 'type', width: 10 },
        { header: 'Status', key: 'status', width: 15 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          id_time_off: item.id_time_off,
          id_employee: item.id_employee,
          name_employee: item.employee.name,
          start_date: item.start_date,
          end_date: item.end_date,
          type: item.type,
          status: item.status,
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=cuti-data}.xlsx`,
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
}
