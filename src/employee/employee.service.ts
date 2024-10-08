/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from 'src/prisma.service';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  private parseDate(dateString: string): Date | null {
    const [day, month, year] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }
  
  async create(createEmployee: Prisma.EmployeeCreateInput) {
    try {
      const hashedPassword = hashSync(createEmployee.password, 10);
      let tanggalLahir: string | null = null;
      if (createEmployee.tanggal_lahir) {
        const parsedDate = this.parseDate(createEmployee.tanggal_lahir);
        if (!parsedDate) {
          throw new BadRequestException('Invalid date format for tanggal_lahir');
        }
        tanggalLahir = parsedDate.toISOString();
      }
      let startWorking: string | null = null;
      if (createEmployee.start_working) {
        const parsedDate = this.parseDate(createEmployee.start_working);
        if (!parsedDate) {
          throw new BadRequestException('Invalid date format for start_working');
        }
        startWorking = parsedDate.toISOString();
      }
      const employeeData = {
        ...createEmployee,
        password: hashedPassword,
        tanggal_lahir: tanggalLahir,
        start_working: startWorking,
      };
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
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Gagal menambahkan data karyawan: ${error.message}`);
    }
  }

  // async create(createEmployee: CreateEmployeeDto) {
  //   try {
  //     const hashedPassword = hashSync(createEmployee.password, 10);
  //     let tanggalLahir: string | null = null;
  //     if (createEmployee.tanggal_lahir) {
  //       const parsedDate = this.parseDate(createEmployee.tanggal_lahir);
  //       if (!parsedDate) {
  //         throw new BadRequestException('Invalid date format for tanggal_lahir');
  //       }
  //       tanggalLahir = parsedDate.toISOString();
  //     }
  //     let startWorking: string | null = null;
  //     if (createEmployee.start_working) {
  //       const parsedDate = this.parseDate(createEmployee.start_working);
  //       if (!parsedDate) {
  //         throw new BadRequestException('Invalid date format for start_working');
  //       }
  //       startWorking = parsedDate.toISOString();
  //     }
  //     const employeeData = {
  //       ...createEmployee,
  //       password: hashedPassword,
  //       tanggal_lahir: tanggalLahir,
  //       start_working: startWorking,
  //     };
  //     const exist = await this.prisma.employee.findFirst({
  //       where: {
  //         email: createEmployee.email,
  //       },
  //     });
  //     if (exist) {
  //       throw new BadRequestException('Email sudah terdaftar');
  //     }
  //     const employee = await this.prisma.employee.create({
  //       data: employeeData,
  //     });
  //     return { message: 'Data karyawan berhasil ditambahkan', data: employee };
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(`Gagal menambahkan data karyawan: ${error.message}`);
  //   }
  // }


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
      throw new BadRequestException('Gagal mengedit data karyawan: ${error.message}');
    }
  }

  // async updateProfileWithToken(
  //   id: number, 
  //   updateEmployeeDto: Prisma.EmployeeUpdateInput
  // ) {
  //   try {
  //     const employee = await this.prisma.employee.findUnique({
  //       where: { id_employee: id },
  //     });

  //     if (!employee) throw new NotFoundException('Data karyawan tidak ditemukan');

  //     const updated = await this.prisma.employee.update({
  //       where: { id_employee: id },
  //       data: updateEmployeeDto,
  //     });

  //     return { message: 'Data karyawan berhasil diedit', data: updated };
  //   } catch (error) {
  //     console.log(error);
  //     throw new BadRequestException('Gagal mengedit data karyawan: ${error.message}');
  //   }
  // }

  async updateProfileWithToken(
    id: number,
    updateEmployeeDto: Prisma.EmployeeUpdateInput
  ) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id_employee: id },
      });

      if (!employee) throw new NotFoundException('Data karyawan tidak ditemukan');

      // Check if updateEmployeeDto.password is a string and hash it
      if (typeof updateEmployeeDto.password === 'string') {
        updateEmployeeDto.password = hashSync(updateEmployeeDto.password, 10);
      } else if (updateEmployeeDto.password instanceof Object) {
        // Handle if password is an object (e.g., update operations)
      }

      const updated = await this.prisma.employee.update({
        where: { id_employee: id },
        data: updateEmployeeDto,
      });

      return { message: 'Data karyawan berhasil diedit', data: updated };
    } catch (error) {

      console.log(error);
      throw new BadRequestException(`Gagal mengedit data karyawan: ${error.message}`);

      throw new BadRequestException('Gagal mengedit data karyawan: ${error.message}');

      throw new BadRequestException(`Gagal mengedit data karyawan: ${error.message}`);


    }
  }

  
 
  async remove(id: number) {
    try {
      const hapusEmployee = await this.prisma.employee.delete({
        where: { id_employee: id },
      });
      if (!hapusEmployee) {
        throw new NotFoundException('employee tidak ditemukan');
      }
      return { message: 'employee berhasil di hapus' };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('employee tidak dapat ditemukan');
      }
      throw error;
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
        'Jabatan dengan ID ${id_jabatan} tidak ditemukan',
      );
    }
    return jabatan.name_jabatan;
  }
}