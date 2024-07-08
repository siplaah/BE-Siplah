import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JabatanModule } from './jabatan/jabatan.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { KeyResultModule } from './key_result/key_result.module';
import { OvertimeModule } from './overtime/overtime.module';
import { DailyReportModule } from './daily_report/daily_report.module';
import { PresensiModule } from './presensi/presensi.module';
import { TimeOffModule } from './time_off/time_off.module';
import { MeetingModule } from './meeting/meeting.module';
import { AssessmentModule } from './assessment/assessment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerOptions } from '@nestjs-modules/mailer';

@Module({
  imports: [
    JabatanModule,
    EmployeeModule,
    AuthModule,
    ProjectModule,
    KeyResultModule,
    OvertimeModule,
    DailyReportModule,
    PresensiModule,
    TimeOffModule,
    MeetingModule,
    AssessmentModule,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'ajengwahyu@gmail.com', // Ganti dengan email Gmail Anda
          pass: 'zmtr aodl gdog wqzs', // Ganti dengan password Gmail Anda atau app-specific password
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>', // Ganti dengan alamat email pengirim default
      },
    } as MailerOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
