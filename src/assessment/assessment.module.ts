import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService, PrismaService]
})
export class AssessmentModule {}
