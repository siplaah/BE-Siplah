import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';

@Controller('overtime')
export class OvertimeController {
  constructor(private readonly overtimeService: OvertimeService) {}

  @Post()
  create(@Body() createOvertimeDto: CreateOvertimeDto) {
    return this.overtimeService.create(createOvertimeDto);
  }

  @Get()
  findAll() {
    return this.overtimeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.overtimeService.findOne({ id_overtime: +id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto,
  ) {
    return this.overtimeService.update({ id_overtime: +id }, updateOvertimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.overtimeService.remove(+id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.overtimeService.approve(+id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string) {
    return this.overtimeService.reject(+id);
  }
}
