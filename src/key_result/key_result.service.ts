import { BadRequestException, Injectable } from '@nestjs/common';
// import { CreateKeyResultDto } from './dto/create-key_result.dto';
// import { UpdateKeyResultDto } from './dto/update-key_result.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class KeyResultService {
  constructor(private prisma: PrismaService) {}

  async create(createKeyResult: Prisma.KeyResultCreateInput) {
    try {
      const createkeyResult = await this.prisma.keyResult.create({
        data: createKeyResult,
      });
      return createkeyResult;
    } catch (error) {
      throw new BadRequestException('Gagal menambahkan key result');
    }
  }

  findAll() {
    return this.prisma.keyResult.findMany();
  }

  async findOne(getKeyResultbyId: Prisma.KeyResultWhereUniqueInput) {
    const getkeyResult = await this.prisma.keyResult.findUnique({
      where: getKeyResultbyId,
    });

    if (!getkeyResult) {
      throw new BadRequestException('data tidak ditemukan');
    }

    return getkeyResult;
  }

  async update(
    where: Prisma.KeyResultWhereUniqueInput,
    data: Prisma.KeyResultUpdateInput,
  ) {
    try {
      const updatekeyResult = await this.prisma.keyResult.update({
        where,
        data,
      });
      return {
        message: 'Key Result berhasil di update',
        keyResult: updatekeyResult,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Key Result tidak dapat ditemukan');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const deleteKeyResult = await this.prisma.keyResult.delete({
        where: { id_key_result: id },
      });
      if (!deleteKeyResult) {
        throw new BadRequestException('Key Result tidak dapat ditemukan');
      }
      return { message: 'Key Result berhasil dihapus' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Key Result tidak dapat ditemukan');
      }
      throw error;
    }
  }
}
