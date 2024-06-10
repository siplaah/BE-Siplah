import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
// import { DailyReportService } from './daily_report.sFervice';
// import { CreateDailyReportDto } from './dto/create-daily_report.dto';
// import { UpdateDailyReportDto } from './dto/update-daily_report.dto';
// import { ResponseEntity } from 'src/common/entity/response.entity';

@Controller('daily-report')
export class DailyReportController {
  // constructor(private readonly dailyReportService: DailyReportService) {}
  // @Post()
  // create(@Body() createDailyReportDto: CreateDailyReportDto) {
  //   return this.dailyReportService.create(createDailyReportDto);
  // }
  // @Get()
  // async findAll() {
  //   try {
  //     return new ResponseEntity(await this.dailyReportService.findAll());
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.dailyReportService.findOne({ id_daily_report: +id });
  // }
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() UpdateDailyReportDto: UpdateDailyReportDto,
  // ) {
  //   try {
  //     const result = await this.dailyReportService.update(
  //       { id_daily_report: +id },
  //       UpdateDailyReportDto,
  //     );
  //     return result;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  //   }
  // }
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.dailyReportService.remove(+id);
  // }
}
