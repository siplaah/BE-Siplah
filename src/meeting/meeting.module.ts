import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  controllers: [MeetingController],
  providers: [MeetingService, PrismaService, AuthService, EmployeeService],
})
export class MeetingModule {}
