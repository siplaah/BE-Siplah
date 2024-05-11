import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JabatanModule } from './jabatan/jabatan.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [JabatanModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
