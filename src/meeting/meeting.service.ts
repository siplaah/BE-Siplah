import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const dateMeeting = new Date(createMeetingDto.date);

    if (isNaN(dateMeeting.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    const isoDate = dateMeeting.toISOString();
    const { id_employee, ...meetingData } = createMeetingDto;
    if (!Array.isArray(id_employee)) {
      throw new BadRequestException('id_employee must be an array');
    }

    try {
      const createMeeting = await this.prisma.meeting.create({
        data: {
          ...meetingData,
          date: isoDate,
          meetingEmployees: {
            create: id_employee.map((id) => ({
              employee: { connect: { id_employee: id } },
            })),
          },
        },
        include: { meetingEmployees: true },
      });

      await this.sendMeetingNotification(createMeeting);

      return createMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw new BadRequestException('Gagal menambahkan meeting');
    }
  }

  private async sendMeetingNotification(meeting) {
    const { description, date, meetingEmployees } = meeting;

    if (!meetingEmployees || !Array.isArray(meetingEmployees)) {
      throw new Error('Invalid meetingEmployees data');
    }

    // Ambil semua ID employee dari meetingEmployees
    const id_employee = meetingEmployees.map((me) => me.id_employee);

    try {
      // Query Prisma untuk mengambil informasi karyawan berdasarkan ID
      const employees = await this.prisma.employee.findMany({
        where: {
          id_employee: {
            in: id_employee, // Mengambil karyawan dengan ID yang terdaftar dalam employeeIds
          },
        },
      });

      // Dapatkan email dari setiap karyawan yang terkait
      const employeeEmails = employees.map((employee) => employee.email);

      // Kirim email notifikasi ke setiap karyawan yang terlibat dalam pertemuan
      await Promise.all(
        employeeEmails.map(async (email) => {
          try {
            await this.mailerService.sendMail({
              to: email,
              subject: 'Pertemuan Baru: ' + description,
              text: `Anda telah dijadwalkan untuk pertemuan baru pada tanggal ${new Date(
                date,
              ).toLocaleDateString()}.`,
            });
            console.log(`Email notifikasi dikirim ke: ${email}`);
          } catch (error) {
            console.error(
              `Gagal mengirim email notifikasi ke: ${email}`,
              error,
            );
          }
        }),
      );
    } catch (error) {
      console.error('Error retrieving employee data:', error);
      throw new Error('Gagal mengambil data karyawan');
    }
  }

  findAll() {
    return this.prisma.meeting.findMany({
      include: { meetingEmployees: true },
    });
  }

  async findOne(getMeetingbyId: Prisma.MeetingWhereUniqueInput) {
    const getMeeting = await this.prisma.meeting.findUnique({
      where: getMeetingbyId,
      include: { meetingEmployees: true },
    });
    if (!getMeeting) {
      throw new BadRequestException('data tidak ditemukan');
    }

    return getMeeting;
  }

  async update(
    where: Prisma.MeetingWhereUniqueInput,
    updateMeetingDto: UpdateMeetingDto,
  ) {
    const { id_employee, ...meetingData } = updateMeetingDto;
    const dateMeeting = new Date(updateMeetingDto.date);

    if (isNaN(dateMeeting.getTime())) {
      throw new BadRequestException('Invalid date format');
    }
    const isoDate = dateMeeting.toISOString();

    try {
      const updateData: Prisma.MeetingUpdateInput = {
        ...meetingData,
        date: isoDate,
        meetingEmployees: {
          connect: id_employee.map((id) => ({
            id_meeting_employee: id,
          })),
        },
      };

      const updateMeeting = await this.prisma.meeting.update({
        where: where,
        data: updateData,
        include: { meetingEmployees: true },
      });
      return {
        message: 'Data meeting berhasil di update',
        meeting: updateMeeting,
      };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.meetingEmployee.deleteMany({
        where: { id_meeting: id },
      });

      const deleteMeeting = await this.prisma.meeting.delete({
        where: { id_meeting: id },
        include: { meetingEmployees: true },
      });
      if (!deleteMeeting) {
        throw new BadRequestException('Data meeting tidak dapat ditemukan');
      }
      return { message: 'Data meeting berhasil dihapus' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Data meeting tidak dapat ditemukan');
      }
      throw error;
    }
  }
}
