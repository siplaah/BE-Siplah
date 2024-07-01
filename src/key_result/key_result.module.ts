import { Module } from '@nestjs/common';
import { KeyResultService } from './key_result.service';
import { KeyResultController } from './key_result.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  controllers: [KeyResultController],
  providers: [KeyResultService, PrismaService, AuthService, EmployeeService],
})
export class KeyResultModule {}
