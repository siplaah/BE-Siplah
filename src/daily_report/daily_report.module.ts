import { Module } from '@nestjs/common';
import { DailyReportService } from './daily_report.service';
import { DailyReportController } from './daily_report.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DailyReportController],
  providers: [DailyReportService, PrismaService]
})
export class DailyReportModule {}
