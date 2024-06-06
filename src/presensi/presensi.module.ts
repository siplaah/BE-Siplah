import { Module } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { PresensiController } from './presensi.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PresensiController],
  providers: [PresensiService, PrismaService]
})
export class PresensiModule {}
