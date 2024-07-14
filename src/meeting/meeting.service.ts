import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, Meeting } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MeetingService {
  constructor(
    private prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    try {
      const dateMeeting = new Date(createMeetingDto.date);

      if (isNaN(dateMeeting.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      const { id_employee, ...meetingData } = createMeetingDto;

      const meetingEmployees = id_employee.map((id_employee) => ({
        employee: { connect: { id_employee } },
      }));

      const createdMeeting = await this.prisma.meeting.create({
        data: {
          ...meetingData,
          date: dateMeeting.toISOString(),
          meetingEmployees: {
            create: meetingEmployees,
          },
        },
        include: { meetingEmployees: true },
      });

      await this.sendMeetingNotification(createdMeeting);

      return createdMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw new BadRequestException('Gagal menambahkan meeting');
    }
  }

  private async sendMeetingNotification(meeting) {
    const {
      start_time,
      end_time,
      link_meeting,
      description,
      date,
      meetingEmployees,
    } = meeting;

    if (!Array.isArray(meetingEmployees)) {
      throw new Error('Invalid meetingEmployees data');
    }

    const id_employee = meetingEmployees.map((me) => me.id_employee);

    try {
      const employees = await this.prisma.employee.findMany({
        where: {
          id_employee: {
            in: id_employee,
          },
        },
      });
      const employeeEmails = employees.map((employee) => employee.email);
      await Promise.all(
        employeeEmails.map(async (email) => {
          try {
            await this.mailerService.sendMail({
              to: email,
              subject: 'Pertemuan Baru: ' + description,
              html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8; text-align: center;">Undangan Pertemuan Baru</h2>
            <p style="color: #555; font-size: 16px;">Anda telah dijadwalkan untuk pertemuan baru:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333;">Detail Pertemuan</h3>
              <p><strong>Judul Pertemuan:</strong> ${description}</p>
              <p><strong>Tanggal & Waktu:</strong> ${new Date(
                date,
              ).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}, ${start_time} - ${end_time} (WIB)</p>
              <p><strong>Link Rapat:</strong> <a href="${link_meeting}" style="color: #1a73e8;">${link_meeting}</a></p>
            </div>
            
            <div style="background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #333;">Daftar Tamu</h3>
              <ul style="list-style-type: none; padding: 0;">
                ${employees
                  .map(
                    (employee) =>
                      `<li style="padding: 5px 0; border-bottom: 1px solid #ddd;">${employee.name}</li>`,
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        `,
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
