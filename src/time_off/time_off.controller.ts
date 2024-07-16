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
  UseInterceptors,
  UploadedFile,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { TimeOffService } from './time_off.service';
import { CreateTimeOffDto } from './dto/create-time_off.dto';
import { UpdateTimeOffDto } from './dto/update-time_off.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@UseGuards(AuthGuard)
@Controller('time-off')
export class TimeOffController {
  constructor(
    private readonly timeOffService: TimeOffService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          callback(null, './uploads');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  create(
    @Body() createTimeOffDto: CreateTimeOffDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const id_employee = req.employee.id;
    return this.timeOffService.create(createTimeOffDto, file, id_employee);
  }

  @Get()
  findAll(
    @Query()
    query: {
      page: number;
      pageSize: number;
      q?: string;
      date?: string;
      id_employee?: number;
    },
  ) {
    const page = parseInt(query.page as any) || 1;
    const pageSize = parseInt(query.pageSize as any) || 10;
    const q = query.q || '';
    const date = query.date;
    const id_employee = query.id_employee;
    return this.timeOffService.findAll({
      page,
      pageSize,
      q,
      date,
      id_employee,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeOffService.findOne({ id_time_off: +id });
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('attachment'))
  update(
    @Param('id') id: string,
    @Body() updateTimeOffDto: UpdateTimeOffDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.timeOffService.update(
      { id_time_off: +id },
      updateTimeOffDto,
      file,
    );
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

  @Get(':id/attachment')
  async getAttachment(@Param('id') id: string) {
    const id_time_off = parseInt(id, 10);

    if (isNaN(id_time_off)) {
      throw new BadRequestException('Invalid ID format');
    }

    console.log('Controller: getAttachment called with:', id_time_off);

    return this.timeOffService.findOne({ id_time_off });
  }
}
