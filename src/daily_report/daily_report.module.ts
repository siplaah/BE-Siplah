import { Module } from '@nestjs/common';
import { DailyReportService } from './daily_report.service';
import { DailyReportController } from './daily_report.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  controllers: [DailyReportController],
  providers: [DailyReportService, PrismaService, AuthService, EmployeeService]
})
export class DailyReportModule {}
