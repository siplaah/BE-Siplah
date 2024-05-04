import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJabatanDto } from './dto/create-jabatan.dto';
import { UpdateJabatanDto } from './dto/update-jabatan.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class JabatanService {
  constructor(private prisma: PrismaService) {}

  async create(createJabatan: Prisma.JabatanCreateInput) {
    try{
      const tambahJabatan = await this.prisma.jabatan.create({
        data: {name_jabatan: createJabatan.name_jabatan},
      });
      return tambahJabatan;
    } catch(error) {
      throw new BadRequestException('gagal menambah jabatan');
    }
  }

  findAll() {
    return this.prisma.jabatan.findMany();
  }

  async findOne(getJabatanbyid: Prisma.JabatanWhereUniqueInput) {
    const jabatan=await this.prisma.jabatan.findUnique({
      where: getJabatanbyid,
    });
    if(!jabatan){
      throw new BadRequestException ('data tidak ditemukan');
    }
    return jabatan;
  }

  async update(where: Prisma.JabatanWhereUniqueInput, data: Prisma.JabatanUpdateInput) {
    try{
      const updateJabatan=await this.prisma.jabatan.update({
        where, data 
      });
  
      return{message: 'jabatan berhasil di update', jabatan: updateJabatan};
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2025') {
        throw new NotFoundException('jabatan tidak dapat ditemukan')
      }
      throw error;
    }
    } 

  async remove(id: number) {
    try {
      const hapusJabatan=await this.prisma.jabatan.delete({
        where:{id_jabatan:id}, 
      });
      if(!hapusJabatan){
        throw new NotFoundException('jabatan tidak ditemukan')
      } return{message: 'jabatan berhasil di hapus'}
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2025') {
        throw new NotFoundException('jabatan tidak dapat ditemukan')
      }
      throw error;
    }
  }
}
