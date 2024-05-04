import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JabatanModule } from './jabatan/jabatan.module';

@Module({
  imports: [JabatanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
