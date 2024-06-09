import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}
  async create(createEmployee: Prisma.EmployeeCreateInput) {
    try {
      const hashedPassword = hashSync(createEmployee.password, 10);
      const employeeData = { ...createEmployee, password: hashedPassword };

      const exist = await this.prisma.employee.findFirst({
        where: {
          email: createEmployee.email,
        },
      });

      if (exist) {
        throw new BadRequestException('Email sudah terdaftar');
      }

      const employee = await this.prisma.employee.create({
        data: employeeData,
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
    return await this.prisma.employee.findMany();
  }

  async findOne(getEmployeebyid: Prisma.EmployeeWhereUniqueInput) {
    const employee = await this.prisma.employee.findUnique({
      where: getEmployeebyid,
    });
    if (!employee) {
      throw new BadRequestException('data tidak ditemukan');
    }
    return employee;
  }

  async update(
    where: Prisma.EmployeeWhereUniqueInput,
    data: Prisma.EmployeeUpdateInput,
  ) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where,
      });

      if (!employee) throw new Error('Data karyawan tidak ditemukan');

      const updated = await this.prisma.employee.update({
        where,
        data,
      });
      return { message: 'Data karyawan berhasil diedit', data: updated };
    } catch (error) {
      throw new BadRequestException('Gagal mengedit data karyawan');
    }
  }

  async remove(id: number) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: {
          id_employee: id,
        },
      });

      if (!employee) throw new Error('Data karyawan tidak ditemukan');

      await this.prisma.employee.delete({
        where: {
          id_employee: id,
        },
      });

      return { message: 'Data karyawan berhasil dihapus', data: null };
    } catch (error) {
      throw new BadRequestException('Gagal menghapus data karyawan');
    }
  }

  async getOneByEmail(email: string) {
    try {
      const data = await this.prisma.employee.findFirst({
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

  async getNamaJabatanById(id_jabatan: number): Promise<string> {
    const jabatan = await this.prisma.jabatan.findUnique({
      where: { id_jabatan: id_jabatan },
      select: { name_jabatan: true },
    });
    if (!jabatan) {
      throw new NotFoundException(
        `Jabatan dengan ID ${id_jabatan} tidak ditemukan`,
      );
    }
    return jabatan.name_jabatan;
  }
}
