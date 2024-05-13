import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { hashSync, verifySync } from '@node-rs/bcrypt';

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

      return { message: 'Data karyawan berhasil ditambahkan', data: employee };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error; // Langsung lempar kesalahan BadRequestException
      }
      throw new BadRequestException(
        `Gagal menambahkan data karyawan: ${error.message}`,
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
      if (!data) throw new BadRequestException('Data karyawan tidak ditemukan');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!employee) throw new Error('Data karyawan tidak ditemukan');

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
      return { message: 'Data karyawan berhasil diedit', data: updated };
    } catch (error) {
      throw new BadRequestException('Gagal mengedit data karyawan');
    }
  }

  async remove(id: number) {
    try {
      const employee = await this.prismaService.employee.findUnique({
        where: {
          id,
        },
      });

      if (!employee) throw new Error('Data karyawan tidak ditemukan');

      await this.prismaService.employee.delete({
        where: {
          id,
        },
      });

      return { message: 'Data karyawan berhasil dihapus', data: null };
    } catch (error) {
      throw new BadRequestException('Gagal menghapus data karyawan');
    }
  }

  async getOneByEmail(email: string) {
    try {
      const data = await this.prismaService.employee.findFirst({
        where: {
          email,
        },
      });
      if (!data) throw new Error('Data karyawan tidak ditemukan');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async verifyPassword(email: string, password: string) {
    try {
      const data = await this.getOneByEmail(email);
      const passwordMatch = verifySync(password, data.password);
      if (!passwordMatch) throw new Error('Wrong password');
      return data;
    } catch (error) {
      throw error;
    }
  }
}
