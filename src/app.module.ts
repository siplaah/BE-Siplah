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
          user: 'aaawp94@gmail.com',
          pass: 'fwcj tgwb jnvm pgde',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    } as MailerOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
