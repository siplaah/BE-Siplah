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
} from '@nestjs/common';
import { TimeOffService } from './time_off.service';
import { CreateTimeOffDto } from './dto/create-time_off.dto';
import { UpdateTimeOffDto } from './dto/update-time_off.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(AuthGuard)
@Controller('time-off')
export class TimeOffController {
  constructor(
    private readonly timeOffService: TimeOffService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createTimeOffDto: CreateTimeOffDto, @Req() req) {
    const id_employee = req.employee.id;
    return this.timeOffService.create(createTimeOffDto, id_employee);
  }

  @Get()
  findAll() {
    return this.timeOffService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeOffService.findOne({ id_time_off: +id });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTimeOffDto: UpdateTimeOffDto) {
    return this.timeOffService.update({ id_time_off: +id }, updateTimeOffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeOffService.remove(+id);
  }

  @Put(':id/approve')
  approve(@Param('id') id: string) {
    return this.timeOffService.approve(+id);
  }

  @Put(':id/reject')
  reject(@Param('id') id: string, @Body('description') description: string) {
    return this.timeOffService.reject(+id, description);
  }
}
