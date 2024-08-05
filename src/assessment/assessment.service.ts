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
    switch (type) {
      case typeAssessment.should_increase_to:
        return Math.round((realisasi / target) * 100);
      case typeAssessment.shoud_decrease_to:
        return Math.round((target / realisasi) * 100);
      case typeAssessment.should_stay_above:
        return realisasi > target ? 100 : 0;
      case typeAssessment.shoud_stay_below:
        return realisasi < target ? 100 : 0;
      case typeAssessment.achieve_or_not:
        return realisasi === 1 ? 100 : 0;
      default:
        throw new BadRequestException('Invalid type');
    }
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
            realisasi: item.realisasi,
            nilai_akhir: nilai_akhir,
            total_nilai: 0,
          };
        }),
      );

      const total_nilai = Math.round(
        assessmentData.reduce((total, item) => total + item.nilai_akhir, 0) /
          assessmentData.length,
      );
      assessmentData.forEach((data) => {
        data.total_nilai = total_nilai;
      });

      await this.prisma.assessmentEmployee.createMany({
        data: assessmentData,
      });

      return {
        id_employee,
        date,
        assessment: assessmentData,
        total_nilai: total_nilai,
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

    console.log('Where clause:', where);

    const assessments = await this.prisma.assessmentEmployee.findMany({
      where,
      include: {
        employee: true,
      },
      // skip: (page - 1) * pageSize,
      // take: pageSize,
    });

    // console.log('Assessments retrieved:', assessments);

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
        if (!result[assessment.employee.id_employee]) {
          result[assessment.employee.id_employee] = {
            employee: {
              id_employee: assessment.employee.id_employee,
              nama: assessment.employee.nama,
            },
            date: assessment.date,
            assessment: [],
            total_nilai: assessment.total_nilai,
          };
        }
        result[assessment.employee.id_employee].assessment.push({
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

    const result = Object.values(groupedAssessments);

    const groupedData = result.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const totalData = groupedData.length;

    return {
      data: groupedData,
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

    const total_nilai = Math.round(
      formattedAssessment.reduce((total, item) => total + item.nilai_akhir, 0) /
        formattedAssessment.length,
    );

    return {
      employee: {
        id_employee: employee.id_employee,
        nama: employee.name,
      },
      assessment: formattedAssessment,
      total_nilai: total_nilai,
    };
  }

  async update(id_employee: number, updateAssessmentDto: UpdateAssessmentDto) {
    try {
      const { assessment, date } = updateAssessmentDto;

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
            keyResult.target,
            item.realisasi,
          );
          return {
            id_key_result: item.id_key_result,
            type: item.type,
            target: keyResult.target,
            realisasi: item.realisasi,
            nilai_akhir: nilai_akhir,
            date: new Date(date).toISOString(),
          };
        }),
      );

      const total_nilai = Math.round(
        assessmentData.reduce((total, item) => total + item.nilai_akhir, 0) /
          assessmentData.length,
      );

      for (const data of assessmentData) {
        const existingRecord = await this.prisma.assessmentEmployee.findFirst({
          where: {
            id_employee: id_employee,
            id_key_result: data.id_key_result,
          },
        });

        if (existingRecord) {
          const updated = await this.prisma.assessmentEmployee.update({
            where: {
              id_assessment: existingRecord.id_assessment,
            },
            data: {
              type: data.type,
              target: data.target,
              realisasi: data.realisasi,
              nilai_akhir: data.nilai_akhir,
              date: new Date(date).toISOString(),
              total_nilai: total_nilai,
            },
          });
          console.log(
            `Updated assessment for employee ${id_employee}, key result ${data.id_key_result}:`,
            updated,
          );
        } else {
          const created = await this.prisma.assessmentEmployee.create({
            data: {
              id_employee: id_employee,
              id_key_result: data.id_key_result,
              type: data.type,
              target: data.target,
              realisasi: data.realisasi,
              nilai_akhir: data.nilai_akhir,
              date: new Date(date).toISOString(),
              total_nilai: total_nilai,
            },
          });
          console.log(
            `Created assessment for employee ${id_employee}, key result ${data.id_key_result}:`,
            created,
          );
        }
      }

      return {
        id_employee: id_employee,
        date,
        assessment: assessmentData,
        total_nilai: total_nilai,
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

  async exportToExcel(res: Response, id_employee: number) {
    try {
      const data = await this.prisma.assessmentEmployee.findMany({
        where: { id_employee },
        include: {
          keyResult: true,
          employee: true,
        },
      });

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Overtime');

      worksheet.columns = [
        { header: 'No', key: 'id_overtime', width: 10 },
        { header: 'ID Karyawan', key: 'id_employee', width: 15 },
        { header: 'Bulan', key: 'date', width: 15 },
        { header: 'Key Result', key: 'id_key_result', width: 15 },
        { header: 'Target', key: 'target', width: 15 },
        { header: 'Tipe', key: 'type', width: 15 },
        { header: 'Realisasi', key: 'realisasi', width: 15 },
        { header: 'Nilai Akhir', key: 'nilai_akhir', width: 15 },
        { header: 'Total Nilai', key: 'total_nilai', width: 15 },
      ];

      data.forEach((item) => {
        worksheet.addRow({
          id_assessment: item.id_assessment,
          id_employee: item.id_employee,
          name_employee: item.employee.name,
          date: item.date,
          id_key_result: item.id_key_result,
          target: item.target,
          type: item.type,
          realisasi: item.realisasi,
          nilai_akhir: item.nilai_akhir,
          total_nilai: item.total_nilai,
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=overtime-data.xlsx',
      );

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }
}
