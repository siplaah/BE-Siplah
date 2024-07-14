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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { OvertimeService } from './overtime.service';
import { CreateOvertimeDto } from './dto/create-overtime.dto';
import { UpdateOvertimeDto } from './dto/update-overtime.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@UseGuards(AuthGuard)
@Controller('overtime')
export class OvertimeController {
  constructor(
    private readonly overtimeService: OvertimeService,
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
  async create(
    @Body() createOvertimeDto: CreateOvertimeDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const id_employee = req.employee.id;
    if (!id_employee) {
      throw new BadRequestException('Employee ID is required');
    }

    const result = await this.overtimeService.create(
      createOvertimeDto,
      file,
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
  @UseInterceptors(FileInterceptor('attachment'))
  update(
    @Param('id') id: string,
    @Body() updateOvertimeDto: UpdateOvertimeDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.overtimeService.update(
      { id_overtime: +id },
      updateOvertimeDto,
      file,
    );
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

  @Get(':id/attachment')
  async getAttachment(@Param('id') id: string) {
    const id_overtime = parseInt(id, 10);

    if (isNaN(id_overtime)) {
      throw new BadRequestException('Invalid ID format');
    }

    console.log('Controller: getAttachment called with:', id_overtime);

    return this.overtimeService.findOne({ id_overtime });
  }
}
