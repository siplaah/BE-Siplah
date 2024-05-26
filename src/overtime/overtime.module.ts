import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [OvertimeController],
  providers: [OvertimeService, PrismaService],
})
export class OvertimeModule {}
