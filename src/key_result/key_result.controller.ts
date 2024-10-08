import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { KeyResultService } from './key_result.service';
import { CreateKeyResultDto } from './dto/create-key_result.dto';
import { UpdateKeyResultDto } from './dto/update-key_result.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(AuthGuard)
@Controller('key-result')
export class KeyResultController {
  constructor(
    private readonly keyResultService: KeyResultService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createKeyResultDto: CreateKeyResultDto) {
    return this.keyResultService.create(createKeyResultDto);
  }

  @Get()
  async findAll(
    @Query() query: { page: number; pageSize: number; q?: string },
  ) {
    const page = parseInt(query.page as any) || 1;
    const pageSize = parseInt(query.pageSize as any) || 10;
    const q = query.q || '';

    return this.keyResultService.findAll({ page, pageSize, q });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keyResultService.findOne({ id_key_result: +id });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateKeyResultDto: UpdateKeyResultDto,
  ) {
    return this.keyResultService.update(
      { id_key_result: +id },
      updateKeyResultDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keyResultService.remove(+id);
  }
}
