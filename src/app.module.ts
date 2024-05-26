import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JabatanModule } from './jabatan/jabatan.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { KeyResultModule } from './key_result/key_result.module';
import { OvertimeModule } from './overtime/overtime.module';

@Module({
  imports: [JabatanModule, EmployeeModule, AuthModule, ProjectModule, KeyResultModule, OvertimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
