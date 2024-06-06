import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException,
  HttpStatus, } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { CreatePresensiDto } from './dto/create-presensi.dto';
import { UpdatePresensiDto } from './dto/update-presensi.dto';
import { ResponseEntity } from 'src/common/entity/response.entity';

@Controller('presensi')
export class PresensiController {
  constructor(private readonly presensiService: PresensiService) {}
  @Post()
  create(@Body() createPresensiDto: CreatePresensiDto) {
    return this.presensiService.create(createPresensiDto);
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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePresensiDto: UpdatePresensiDto) {
  //   return this.presensiService.update(+id, updatePresensiDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.presensiService.remove(+id);
  // }
}
