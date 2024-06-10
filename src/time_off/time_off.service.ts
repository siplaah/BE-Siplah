import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTimeOffDto } from './dto/create-time_off.dto';
import { UpdateTimeOffDto } from './dto/update-time_off.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Status } from '@prisma/client';

@Injectable()
export class TimeOffService {
  constructor(private prisma: PrismaService) {}

  async create(createTimeOffDto: CreateTimeOffDto, id_employee: number) {
    try {
      const { start_date, end_date } = createTimeOffDto;
      const total_hari = this.hitungTotalHari(start_date, end_date);

      if (total_hari <= 0) {
        throw new BadRequestException('Durasi cuti tidak valid');
      }

      const tambahCuti = await this.prisma.timeOff.create({
        data: {
          id_employee: id_employee,
          start_date: new Date(createTimeOffDto.start_date),
          end_date: new Date(createTimeOffDto.end_date),
          type: createTimeOffDto.type,
          attachment: createTimeOffDto.attachment,
          status: 'pending',
          description: createTimeOffDto.description,
        },
      });

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
      throw new BadRequestException('Gagal menambahkan pengajuan', error);
    }
  }

  async findAll() {
    const allTimeOff = await this.prisma.timeOff.findMany();
    const showTotalCuti = await Promise.all(
      allTimeOff.map(async (timeOff) => {
        const employee = await this.prisma.employee.findUnique({
          where: { id_employee: timeOff.id_employee },
          select: { cuti: true },
        });
        return {
          ...timeOff,
          jumlah_cuti: employee.cuti,
        };
      }),
    );
    return showTotalCuti;
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

      const updateTimeOff = await this.prisma.timeOff.update({
        where,
        data: {
          start_date: updateTimeOffDto.start_date
            ? new Date(updateTimeOffDto.start_date)
            : undefined,
          end_date: updateTimeOffDto.end_date
            ? new Date(updateTimeOffDto.end_date)
            : undefined,
          attachment: updateTimeOffDto.attachment,
          type: updateTimeOffDto.type,
          status: updateTimeOffDto.status,
          description: updateTimeOffDto.description,
        },
      });

      if (updateTimeOffDto.status === Status.approved) {
        const total_hari = this.hitungTotalHari(
          updateTimeOff.start_date.toISOString(),
          updateTimeOff.end_date.toISOString(),
        );
        await this.jumlahCuti(updateTimeOff.id_employee, total_hari);
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

    await this.jumlahCuti(approvedTimeOff.id_employee, total_hari);

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

  async reject(id: number, description: string) {
    const getTimeOff = await this.prisma.timeOff.findUnique({
      where: { id_time_off: id },
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

    return this.prisma.timeOff.update({
      where: { id_time_off: id },
      data: { status: 'rejected', description },
    });
  }

  private hitungTotalHari(start_date: string, end_date: string): number {
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const hitungWaktu = endDate.getTime() - startDate.getTime();
    const hitungHari = Math.ceil(hitungWaktu / (1000 * 3600 * 24));
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
}
