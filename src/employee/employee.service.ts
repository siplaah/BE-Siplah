import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { hashSync } from '@node-rs/bcrypt';

@Injectable()
export class EmployeeService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateEmployeeDto) {
    try {
      const exist = await this.prismaService.employee.findFirst({
        where: {
          email: data.email,
        },
      });

      if (exist) {
        throw new BadRequestException('Email sudah terdaftar');
      }

      const employee = await this.prismaService.employee.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashSync(data.password),
        },
      });

      return { message: 'Data employee berhasil ditambahkan', data: employee };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Langsung lempar kesalahan BadRequestException
      }
      throw new BadRequestException(
        `Gagal menambahkan data employee: ${error.message}`,
      );
    }
  }

  async findAll() {
    return await this.prismaService.employee.findMany();
  }

  async findOne(id: number) {
    try {
      const data = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });
      if (!data) throw new BadRequestException('User not found');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const user = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new Error('User not found');

      const updated = await this.prismaService.employee.update({
        where: {
          id,
        },
        data: {
          name: updateEmployeeDto.name,
          email: updateEmployeeDto.email,
          password: updateEmployeeDto.password,
        },
      });
      return { message: 'Data employee berhasil diedit', data: updated };
    } catch (error) {
      throw new BadRequestException('Gagal mengedit data employee');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!user) throw new Error('User not found');

      await this.prismaService.employee.delete({
        where: {
          id,
        },
      });

      return { message: 'Data employee berhasil dihapus', data: null };
    } catch (error) {
      throw new BadRequestException('Gagal menghapus data employee');
    }
  }
}
