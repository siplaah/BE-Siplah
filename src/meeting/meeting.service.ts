import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MeetingService {
  constructor(private prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto) {
    try {
      const createMeeting = await this.prisma.meeting.create({
        data: {
          id_employee: createMeetingDto.id_employee,
          date: new Date(createMeetingDto.date),
          start_time: createMeetingDto.start_time,
          end_time: createMeetingDto.end_time,
          link_meeting: createMeetingDto.link_meeting,
          description: createMeetingDto.description,
        },
      });
      return createMeeting;
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw new BadRequestException('Gagal menambahkan meeting');
    }
  }

  findAll() {
    return this.prisma.meeting.findMany();
  }

  async findOne(getMeetingbyId: Prisma.MeetingWhereUniqueInput) {
    const getMeeting = await this.prisma.meeting.findUnique({
      where: getMeetingbyId,
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
    try {
      const updateMeeting = await this.prisma.meeting.update({
        where,
        data: {
          id_employee: updateMeetingDto.id_employee,
          date: updateMeetingDto.date
            ? new Date(updateMeetingDto.date)
            : undefined,
          start_time: updateMeetingDto.start_time,
          end_time: updateMeetingDto.end_time,
          link_meeting: updateMeetingDto.link_meeting,
          description: updateMeetingDto.description,
        },
      });
      return {
        message: 'Data meeting berhasil di update',
        meeting: updateMeeting,
      };
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

  async remove(id: number) {
    try {
      const deleteMeeting = await this.prisma.meeting.delete({
        where: { id_meeting: id },
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
