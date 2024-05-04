import { Module } from '@nestjs/common';
import { JabatanService } from './jabatan.service';
import { JabatanController } from './jabatan.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [JabatanController],
  providers: [JabatanService, PrismaService]
})
export class JabatanModule {}
