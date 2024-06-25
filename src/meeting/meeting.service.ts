import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const dateMeeting = new Date(createMeetingDto.date)
    
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
      return createMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw new BadRequestException('Gagal menambahkan meeting');
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
    const dateMeeting = new Date(updateMeetingDto.date)
    
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
