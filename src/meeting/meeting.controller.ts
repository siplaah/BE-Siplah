import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('meeting')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createMeetingDto: CreateMeetingDto) {
    return this.meetingService.create(createMeetingDto);
  }

  @Get()
  findAll(
    @Query()
    query: {
      page: number;
      pageSize: number;
      q?: string;
      date?: string;
    },
  ) {
    const page = parseInt(query.page as any) || 1;
    const pageSize = parseInt(query.pageSize as any) || 10;
    const q = query.q || '';
    const date = query.date;
    return this.meetingService.findAll({ page, pageSize, q, date });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meetingService.findOne({ id_meeting: +id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMeetingDto: UpdateMeetingDto) {
    return this.meetingService.update({ id_meeting: +id }, updateMeetingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meetingService.remove(+id);
  }
}
