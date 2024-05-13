import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JabatanModule } from './jabatan/jabatan.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [JabatanModule, EmployeeModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
