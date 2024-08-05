import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import * as path from 'path';
import * as fs from 'fs';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class OvertimeService {
  constructor(private prisma: PrismaService) {}

  async create(
    createOvertimeDto: CreateOvertimeDto,
    file: Express.Multer.File | undefined,
    id_employee: number,
  ) {
    try {
      const startDate = new Date(createOvertimeDto.start_date);
      const endDate = new Date(createOvertimeDto.end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid date format');
      }
      let attachmentPath: string | null = null;
      if (file) {
        const { path: filePath, originalname } = file;
        attachmentPath = `uploads/${Date.now()}-${originalname}`;
        fs.renameSync(filePath, attachmentPath);
      }

      const tambahOvertime = await this.prisma.overtimes.create({
        data: {
          employee: {
            connect: {
              id_employee: id_employee,
            },
          },
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          start_time: createOvertimeDto.start_time,
          end_time: createOvertimeDto.end_time,
          status: createOvertimeDto.status,
          description: createOvertimeDto.description,
          attachment: attachmentPath,
        },
      });

      return tambahOvertime;
    } catch (error) {
      console.error('Error creating overtime:', error);
      throw new BadRequestException('Gagal menambahkan pengajuan');
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

    const totalData = await this.prisma.overtimes.count({ where });

    const overtimes = await this.prisma.overtimes.findMany({
      where,
      orderBy: {
        start_date: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const sortedOvertimes = overtimes.sort((a, b) => {
      const statusOrder = {
        rejected: 1,
        pending: 2,
        approved: 3,
      };

      return statusOrder[a.status] - statusOrder[b.status];
    });

    return {
      data: sortedOvertimes,
      totalData: totalData,
    };
  }

  async findOne(getOvertimebyId: Prisma.OvertimesWhereUniqueInput) {
    console.log('findOne called with:', getOvertimebyId);

    if (!getOvertimebyId || isNaN(getOvertimebyId.id_overtime)) {
      throw new BadRequestException('Invalid ID');
    }

    try {
      const getOvertime = await this.prisma.overtimes.findUnique({
        where: getOvertimebyId,
      });

      if (!getOvertime) {
        throw new Error('Overtime not found');
      }

      return getOvertime;
    } catch (error) {
      throw new Error(`Error retrieving overtime: ${error.message}`);
    }
  }

  async update(
    where: Prisma.OvertimesWhereUniqueInput,
    updateOvertimeDto: UpdateOvertimeDto,
    file: Express.Multer.File | undefined,
  ) {
    try {
      const existingOvertime = await this.prisma.overtimes.findUnique({
        where,
      });

      if (!existingOvertime) {
        console.error('Overtime request not found:', where);
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }

      let attachmentPath: string | null = null;
      if (file && file.path) {
        attachmentPath = path.basename(file.path);
      }

      const updateData: Prisma.OvertimesUpdateInput = {
        start_date: updateOvertimeDto.start_date
          ? new Date(updateOvertimeDto.start_date).toISOString()
          : undefined,
        end_date: updateOvertimeDto.end_date
          ? new Date(updateOvertimeDto.end_date).toISOString()
          : undefined,
        start_time: updateOvertimeDto.start_time,
        end_time: updateOvertimeDto.end_time,
        status: 'pending',
        description: updateOvertimeDto.description,
        attachment: attachmentPath || undefined,
      };

      const updateOvertime = await this.prisma.overtimes.update({
        where,
        data: updateData,
      });

      return {
        message: 'Pengajuan berhasil diupdate',
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

  async reject(id_overtime: number, description: string) {
    // const descriptionStr = String(description);

    try {
      const getOvertime = await this.prisma.overtimes.findUnique({
        where: {
          id_overtime: id_overtime,
        },
      });

      if (!getOvertime) {
        throw new BadRequestException('Pengajuan tidak dapat ditemukan');
      }

      if (getOvertime.status === 'approved') {
        throw new BadRequestException(
          'Pengajuan yang sudah diapprove tidak dapat direject',
        );
      }

      if (!description) {
        throw new BadRequestException(
          'Deskripsi alasan penolakan harus disertakan',
        );
      }

      const updateOvertime = await this.prisma.overtimes.update({
        where: {
          id_overtime: id_overtime,
        },
        data: {
          status: 'rejected',
          description: description,
        },
      });
      return updateOvertime;
    } catch (error) {
      console.error('Error during update:', error);
      throw error;
    }
  }

  async exportToExcel(res: Response) {
    try {
      const data = await this.prisma.overtimes.findMany({
        include: {
          employee: true,
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Overtime');

      worksheet.columns = [
        { header: 'No', key: 'id_overtime', width: 10 },
        { header: 'ID Karyawan', key: 'id_employee', width: 15 },
        { header: 'Nama Karyawan', key: 'name_employee', width: 15 },
        { header: 'Tanggal Mulai', key: 'start_date', width: 20 },
        { header: 'Tanggal Selesai', key: 'end_date', width: 20 },
        { header: 'Waktu Mulai', key: 'start_time', width: 15 },
        { header: 'Waktu Selesai', key: 'end_time', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Description', key: 'description', width: 30 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          id_overtime: item.id_overtime,
          id_employee: item.id_employee,
          name_employee: item.employee.name,
          start_date: item.start_date,
          end_date: item.end_date,
          start_time: item.start_time,
          end_time: item.end_time,
          status: item.status,
          description: item.description,
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=overtime-data.xlsx',
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
}
