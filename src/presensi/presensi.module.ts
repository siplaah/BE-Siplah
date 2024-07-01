import { Module } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { PresensiController } from './presensi.controller';
import { PrismaService } from 'src/prisma.service';
import { EmployeeService } from 'src/employee/employee.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [PresensiController],
  providers: [PresensiService, PrismaService, EmployeeService, AuthService]
})
export class PresensiModule {}
