import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma, typeAssessment } from '@prisma/client';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  private NilaiAkhir(
    type: typeAssessment,
    realisasi: number,
    target: number,
  ): number {
    let nilai_akhir: number;
    switch (type) {
      case typeAssessment.should_increase_to:
        nilai_akhir = Math.round((realisasi / target) * 100);
        break;
      case typeAssessment.shoud_decrease_to:
        nilai_akhir = Math.round((target / realisasi) * 100);
        break;
      case typeAssessment.should_stay_above:
        nilai_akhir = realisasi > target ? 100 : 0;
        break;
      case typeAssessment.shoud_stay_below:
        nilai_akhir = realisasi < target ? 100 : 0;
        break;
      case typeAssessment.achieve_or_not:
        nilai_akhir = realisasi === 1 ? 100 : 0;
        break;
      default:
        throw new BadRequestException('Invalid type');
    }
    return Math.min(nilai_akhir, 100);
  }

  private calculateTotalNilai(assessmentData: any[]): {
    total_nilai: number;
    final_total_nilai: number;
  } {
    const total_nilai = Math.round(
      assessmentData.reduce((total, item) => total + item.nilai_akhir, 0) /
        assessmentData.length,
    );
    const final_total_nilai = Math.min(total_nilai, 100);
    return { total_nilai, final_total_nilai };
  }

  async create(createAssessmentDto: CreateAssessmentDto) {
    try {
      const { id_employee, assessment } = createAssessmentDto;
      const date = new Date(createAssessmentDto.date);

      if (!assessment || !Array.isArray(assessment)) {
        throw new BadRequestException('Assessment data is missing or invalid');
      }

      const totalKeyResults = await this.prisma.keyResult.count();

      if (assessment.length !== totalKeyResults) {
        throw new BadRequestException(
          'Jumlah assessment tidak sesuai dengan jumlah key result yang ada',
        );
      }

      const assessmentData = await Promise.all(
        assessment.map(async (item) => {
          const keyResult = await this.prisma.keyResult.findUnique({
            where: { id_key_result: item.id_key_result },
          });
          if (!keyResult) {
            throw new BadRequestException('Key result tidak ditemukan');
          }

          let realisasi = item.realisasi;
          if (
            item.type === typeAssessment.should_increase_to ||
            item.type === typeAssessment.shoud_decrease_to
          ) {
            realisasi = Math.min(item.realisasi, keyResult.target);
          }
          const nilai_akhir = this.NilaiAkhir(
            item.type,
            item.realisasi,
            keyResult.target,
          );
          return {
            id_employee: id_employee,
            date: date.toISOString(),
            id_key_result: item.id_key_result,
            type: item.type,
            target: keyResult.target,
            realisasi: realisasi,
            nilai_akhir: nilai_akhir,
            total_nilai: 0,
          };
        }),
      );

      const { final_total_nilai } = this.calculateTotalNilai(assessmentData);
      assessmentData.forEach((data) => {
        data.total_nilai = final_total_nilai;
      });

      await this.prisma.assessmentEmployee.createMany({
        data: assessmentData,
      });

      return {
        id_employee,
        date,
        assessment: assessmentData,
        total_nilai: final_total_nilai,
      };
    } catch (error) {
      console.error('Error create penilaian karyawan:', error);
      throw new BadRequestException('Gagal menambahkan penilaian karyawan');
    }
  }

  async findAll(params: {
    page?: number;
    pageSize?: number;
    q?: string;
    date?: string;
  }) {
    const { q, date } = params;
    const where: Prisma.AssessmentEmployeeWhereInput = {};

    if (q) {
      where.employee = {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      };
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);

      where.date = {
        gte: startDate.toISOString(),
        lt: endDate.toISOString(),
      };
    }

    const assessments = await this.prisma.assessmentEmployee.findMany({
      where,
      include: {
        employee: true,
      },
    });

    const transformedAssessments = assessments.map((assessment) => ({
      id_key_result: assessment.id_key_result,
      type: assessment.type,
      target: assessment.target,
      realisasi: assessment.realisasi,
      nilai_akhir: assessment.nilai_akhir,
      employee: {
        id_employee: assessment.employee.id_employee,
        nama: assessment.employee.name,
      },
      total_nilai: assessment.total_nilai,
      date: assessment.date,
    }));

    const groupedAssessments = transformedAssessments.reduce(
      (result, assessment) => {
        const month = `${assessment.employee.id_employee} - ${
          new Date(assessment.date).getMonth() + 1
        }-${new Date(assessment.date).getFullYear}`;

        if (!result[month]) {
          result[month] = {
            employee: {
              id_employee: assessment.employee.id_employee,
              nama: assessment.employee.nama,
            },
            date: assessment.date,
            assessment: [],
            total_nilai: assessment.total_nilai,
          };
        }
        result[month].assessment.push({
          id_key_result: assessment.id_key_result,
          type: assessment.type,
          target: assessment.target,
          realisasi: assessment.realisasi,
          nilai_akhir: assessment.nilai_akhir,
        });

        return result;
      },
      {},
    );

    const result = Object.values(groupedAssessments).sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const totalData = result.length;

    return {
      data: result,
      totalData,
    };
  }

  async findOne(id_employee: number) {
    const assessments = await this.prisma.assessmentEmployee.findMany({
      where: { id_employee },
      include: {
        keyResult: true,
        employee: true,
      },
    });

    if (assessments.length === 0) {
      throw new BadRequestException('Penilaian karyawan tidak dapat ditemukan');
    }

    const { employee } = assessments[0];
    const formattedAssessment = assessments.map((assessment) => ({
      id_key_result: assessment.id_key_result,
      type: assessment.type,
      target: assessment.target,
      realisasi: assessment.realisasi,
      nilai_akhir: assessment.nilai_akhir,
    }));

    const { final_total_nilai } = this.calculateTotalNilai(formattedAssessment);

    return {
      employee: {
        id_employee: employee.id_employee,
        nama: employee.name,
      },
      assessment: formattedAssessment,
      total_nilai: final_total_nilai,
    };
  }

  async update(id_employee: number, updateAssessmentDto: UpdateAssessmentDto) {
    try {
      const { assessment, date } = updateAssessmentDto;

      await this.prisma.assessmentEmployee.deleteMany({
        where: {
          id_employee: id_employee,
          date: new Date(date).toISOString(), // Sesuaikan format tanggal jika perlu
        },
      });

      const assessmentData = await Promise.all(
        assessment.map(async (item) => {
          const keyResult = await this.prisma.keyResult.findUnique({
            where: { id_key_result: item.id_key_result },
          });
          if (!keyResult) {
            throw new BadRequestException('Key result tidak ditemukan');
          }
          const nilai_akhir = this.NilaiAkhir(
            item.type,
            item.realisasi,
            keyResult.target,
          );
          return {
            id_employee: id_employee,
            id_key_result: item.id_key_result,
            type: item.type,
            target: keyResult.target,
            realisasi: item.realisasi,
            nilai_akhir: nilai_akhir,
            date: new Date(date).toISOString(),
            total_nilai: 0, // Set total_nilai, akan dihitung kemudian
          };
        }),
      );

      const { total_nilai, final_total_nilai } =
        this.calculateTotalNilai(assessmentData);
      assessmentData.forEach((data) => {
        data.total_nilai = total_nilai;
      });

      await this.prisma.assessmentEmployee.createMany({
        data: assessmentData,
      });

      return {
        id_employee: id_employee,
        date,
        assessment: assessmentData,
        total_nilai: final_total_nilai,
      };
    } catch (error) {
      console.error('Error updating employee assessments:', error);
      throw new BadRequestException('Gagal mengedit penilaian karyawan');
    }
  }

  async remove(id_employee: number) {
    try {
      const deleteAssessment = await this.prisma.assessmentEmployee.deleteMany({
        where: { id_employee: id_employee },
      });
      if (!deleteAssessment) {
        throw new BadRequestException('Penilaian kerja not found');
      }
      return { message: 'Penilaian kerja berhasil dihapus' };
    } catch (error) {
      console.error('Error delete penilaian karyawan:', error);
      throw new BadRequestException('Gagal menghapus penilaian karyawan');
    }
  }

  async exportToExcel(res: Response) {
    try {
      const assessments = await this.prisma.assessmentEmployee.findMany({
        include: {
          employee: true,
          keyResult: true,
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Penilaian Karyawan');

      worksheet.columns = [
        { header: 'Key Results', key: 'key_result', width: 40 },
        { header: 'Karyawan', key: 'name', width: 20 },
        { header: 'Type', key: 'type', width: 20 },
        { header: 'Target', key: 'target', width: 10 },
        { header: 'Realisasi', key: 'realisasi', width: 10 },
        { header: 'Nilai Akhir', key: 'nilai_akhir', width: 15 },
      ];

      let currentEmployee = '';
      let employeeTotalScore = 0;
      let employeeScoreCount = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let startRow = 2;

      assessments.forEach((item) => {
        if (currentEmployee !== item.employee.name) {
          if (currentEmployee !== '') {
            worksheet.addRow({
              key_result: 'Total Nilai',
              nilai_akhir: employeeTotalScore / employeeScoreCount,
            }).font = { bold: true };

            worksheet.addRow({});
          }

          currentEmployee = item.employee.name;
          employeeTotalScore = 0;
          employeeScoreCount = 0;

          startRow = worksheet.lastRow.number + 1;
        }

        worksheet.addRow({
          key_result: item.keyResult.key_result,
          name: item.employee.name,
          type: item.type,
          target: item.target,
          realisasi: item.realisasi,
          nilai_akhir: item.nilai_akhir,
        });

        employeeTotalScore += item.nilai_akhir;
        employeeScoreCount += 1;
      });

      worksheet.addRow({
        key_result: 'Total Nilai',
        nilai_akhir: employeeTotalScore / employeeScoreCount,
      }).font = { bold: true };

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        if (rowNumber % 2 === 0) {
          row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFEFEFEF' },
          };
        }
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="assessment-data.xlsx"',
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
}
