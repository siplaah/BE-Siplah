import { Module } from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { OvertimeController } from './overtime.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  controllers: [OvertimeController],
  providers: [OvertimeService, PrismaService, AuthService, EmployeeService],
})
export class OvertimeModule {}
