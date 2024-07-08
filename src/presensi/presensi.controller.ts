import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException,
  HttpStatus, Req, BadRequestException,
  UseGuards,} from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { CreatePresensiDto } from './dto/create-presensi.dto';
import { UpdatePresensiDto } from './dto/update-presensi.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('presensi')
export class PresensiController {
  constructor(
    private readonly presensiService: PresensiService
    ) {}
  
  @Post()
  async create(
    @Body() createPresensiDto: CreatePresensiDto,
    @Req() req,
    ) {
      const id_employee = req.employee.id;
      if (!id_employee) {
        throw new BadRequestException('Employee ID is required');
      }
      const result = await this.presensiService.create(
        createPresensiDto,
        id_employee,
      );
      return result;
    }


  @Get()
  async findAll() {
    try {
      return new ResponseEntity(await this.presensiService.findAll());
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return new ResponseEntity(await this.presensiService.findOne({id_presensi: +id}));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePresensiDto: UpdatePresensiDto,
  ) {
    return this.presensiService.update({ id_presensi: +id }, updatePresensiDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.presensiService.remove(+id);
  }
}
