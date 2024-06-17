import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('overtime')
export class OvertimeController {
  constructor(
    private readonly overtimeService: OvertimeService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createOvertimeDto: CreateOvertimeDto, @Req() req) {
    const id_employee = req.employee.id;
    if (!id_employee) {
      throw new BadRequestException('Employee ID is required');
    }
    const formattedData = {
      ...createOvertimeDto,
      start_date: new Date(createOvertimeDto.start_date),
      end_date: new Date(createOvertimeDto.end_date),
    };

    const result = await this.overtimeService.create(
      formattedData,
      id_employee,
    );
    return result;
  }

  @Get()
  findAll() {
    return this.overtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne({ id_overtime: +id });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto,
  ) {
    return this.overtimeService.update({ id_overtime: +id }, updateOvertimeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.overtimeService.approve(+id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body('description') description: string) {
    return this.overtimeService.reject(+id, description);
  }
}
