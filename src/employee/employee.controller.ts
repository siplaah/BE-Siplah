import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { Req, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create(@Body() createEmployee: Prisma.EmployeeCreateInput) {
    return await this.employeeService.create(createEmployee);
  }

  @Get()
  async findAll() {
    try {
      return new ResponseEntity(await this.employeeService.findAll());
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseEntity(
        await this.employeeService.findOne({ id_employee: +id }),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    try {
      const result = await this.employeeService.update(
        { id_employee: +id },
        updateEmployeeDto,
      );
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
// buka komen ini
  // @Patch('profilesetting')
  // async profileSetting(
  //   @Req() req: Request & { employee: any },
  //   @Body() updateEmployeeDto: UpdateEmployeeDto,
  // ) {
  //   console.log('req.employee:', req.employee); // Tambahkan ini
  //   const { id } = req.employee;
  //   console.log('id:', id); // Tambahkan ini
  
  //   const employeeId = parseInt(id, 10); // Konversi id menjadi integer
  //   if (isNaN(employeeId)) {
  //     throw new HttpException('Invalid employee id', HttpStatus.BAD_REQUEST);
  //   }
  
  //   try {
  //     const result = await this.employeeService.update(
  //       { id_employee: employeeId },
  //       updateEmployeeDto,
  //     );
  //     return result;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.employeeService.remove(+id);
  }
}
