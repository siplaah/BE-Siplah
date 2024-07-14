import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import * as path from 'path';
import * as fs from 'fs';

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

  findAll() {
    return this.prisma.overtimes.findMany();
  }

  async findOne(getOvertimebyId: Prisma.OvertimesWhereUniqueInput) {
    console.log('findOne called with:', getOvertimebyId);

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

      // Handle attachment path
      let attachmentPath: string | null = null;
      if (file && file.path) {
        // Check if file and file.path are defined
        attachmentPath = path.basename(file.path); // Extract the filename
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
        attachment: attachmentPath || undefined, // Ensure attachment is either a valid path or undefined
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
}
