/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PrismaService } from 'src/prisma.service';
import { JabatanService } from 'src/jabatan/jabatan.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, PrismaService, JabatanService, AuthService],
  exports: [EmployeeService],
})
export class EmployeeModule {}
