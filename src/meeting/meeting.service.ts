import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto) {
    const { id_employee, ...meetingData } = createMeetingDto;

    try {
      const createMeeting = await this.prisma.meeting.create({
        data: {
          ...meetingData,
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
      include: { employee: true },
    });
  }

  async findOne(getMeetingbyId: Prisma.MeetingWhereUniqueInput) {
    const getMeeting = await this.prisma.meeting.findUnique({
      where: getMeetingbyId,
      include: { employee: true },
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
    try {
      const updateData: Prisma.MeetingUpdateInput = {
        ...meetingData,
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
      // Handle specific Prisma error P2025 (not found)
      throw error;
    }
  }
  

  async remove(id: number) {
    try {
      const deleteMeeting = await this.prisma.meeting.delete({
        where: { id_meeting: id },
        include: { employee: true },
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
