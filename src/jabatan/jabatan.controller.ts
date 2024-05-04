import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JabatanService } from './jabatan.service';
import { CreateJabatanDto } from './dto/create-jabatan.dto';
import { UpdateJabatanDto } from './dto/update-jabatan.dto';

@Controller('jabatan')
export class JabatanController {
  constructor(private readonly jabatanService: JabatanService) {}

  @Post()
  create(@Body() createJabatanDto: CreateJabatanDto) {
    return this.jabatanService.create(createJabatanDto);
  }

  @Get()
  findAll() {
    return this.jabatanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jabatanService.findOne({id_jabatan:+id});
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateJabatanDto: UpdateJabatanDto) {
    return this.jabatanService.update({id_jabatan:+id}, updateJabatanDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.jabatanService.remove(+id);
  }
}
