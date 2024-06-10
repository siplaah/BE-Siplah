import { Module } from '@nestjs/common';
import { TimeOffService } from './time_off.service';
import { TimeOffController } from './time_off.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  controllers: [TimeOffController],
  providers: [TimeOffService, PrismaService, AuthService, EmployeeService],
})
export class TimeOffModule {}
