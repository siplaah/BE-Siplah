import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { PrismaService } from 'src/prisma.service';
import { typeAssessment } from '@prisma/client';

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
        return Number(((realisasi / target) * 100).toFixed(2));
      case typeAssessment.shoud_decrease_to:
        return Number(((target / realisasi) * 100).toFixed(2));
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
            id_employee: id_employee,
            id_key_result: item.id_key_result,
            type: item.type,
            target: keyResult.target,
            realisasi: item.realisasi,
            nilai_akhir: parseFloat(nilai_akhir.toFixed(2)),
            total_nilai: 0,
          };
        }),
      );

      const total_nilai =
        assessmentData.reduce((acc, cur) => acc + cur.nilai_akhir, 0) /
        assessmentData.length;
      assessmentData.forEach((data) => {
        data.total_nilai = total_nilai;
      });

      await this.prisma.assessmentEmployee.createMany({
        data: assessmentData,
      });

      return {
        id_employee,
        assessment: assessmentData,
        total_nilai: parseFloat(total_nilai.toFixed(2)),
      };
    } catch (error) {
      console.error('Error create penilaian karyawan:', error);
      throw new BadRequestException('Gagal menambahkan penilaian karyawan');
    }
  }

  async findAll() {
    const assessments = await this.prisma.assessmentEmployee.findMany({
      include: {
        keyResult: true,
        employee: true,
      },
    });

    const groupByEmployee = assessments.reduce((result, assessment) => {
      const {
        id_employee,
        employee,
        id_key_result,
        type,
        target,
        realisasi,
        nilai_akhir,
        total_nilai,
      } = assessment;
      if (!result[id_employee]) {
        result[id_employee] = {
          employee: {
            id_employee: employee.id_employee,
            nama: employee.name,
          },
          assessment: [],
          total_nilai: parseFloat(total_nilai.toFixed(2)),
        };
      }
      result[id_employee].assessment.push({
        id_key_result,
        type,
        target,
        realisasi,
        nilai_akhir: parseFloat(assessment.nilai_akhir.toFixed(2)),
      });
      return result;
    }, {});

    return Object.values(groupByEmployee);
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
      nilai_akhir: parseFloat(assessment.nilai_akhir.toFixed(2)),
    }));

    const total_nilai = (
      formattedAssessment.reduce((acc, cur) => acc + cur.nilai_akhir, 0) /
      formattedAssessment.length
    ).toFixed(2);

    return {
      employee: {
        id_employee: employee.id_employee,
        nama: employee.name,
      },
      assessment: formattedAssessment,
      total_nilai: parseFloat(total_nilai),
    };
  }

  async update(id_employee: number, updateAssessmentDto: UpdateAssessmentDto) {
    try {
      const { assessment } = updateAssessmentDto;
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
          };
        }),
      );

      const total_nilai =
        assessmentData.reduce((acc, cur) => acc + cur.nilai_akhir, 0) /
        assessmentData.length;

      for (const data of assessmentData) {
        await this.prisma.assessmentEmployee.updateMany({
          where: {
            id_employee: id_employee,
            id_key_result: data.id_key_result,
          },
          data: {
            type: data.type,
            target: data.target,
            realisasi: data.realisasi,
            nilai_akhir: data.nilai_akhir,
          },
        });
      }
      return {
        id_employee: id_employee,
        assessment: assessmentData,
        total_nilai: parseFloat(total_nilai.toFixed(2)),
      };
    } catch (error) {
      console.error('Error update penilaian karyawan:', error);
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
}
