import { Module } from '@nestjs/common';
import { KeyResultService } from './key_result.service';
import { KeyResultController } from './key_result.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [KeyResultController],
  providers: [KeyResultService, PrismaService],
})
export class KeyResultModule {}
