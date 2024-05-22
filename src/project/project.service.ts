import { BadRequestException, Injectable, NotFoundException  } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProject: Prisma.ProjectCreateInput) {
    try{
      const tambahProject = await this.prisma.project.create({
        data: createProject,
      });
      return tambahProject;
    } catch(error) {
      throw new BadRequestException('gagal menambah project');
    }
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  async findOne(getProjectbyid: Prisma.ProjectWhereUniqueInput) {
    const project=await this.prisma.project.findUnique({
      where: getProjectbyid,
    });
    if(!project){
      throw new BadRequestException ('data tidak ditemukan');
    }
    return project;
  }

  async update(where: Prisma.ProjectWhereUniqueInput, data: Prisma.ProjectUpdateInput) {
    try{
      const updateProject=await this.prisma.project.update({
        where, data 
      });
  
      return{message: 'project berhasil di update', project: updateProject};
    } catch (error) {
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2025') {
        throw new NotFoundException('project tidak dapat ditemukan')
      }
      throw error;
    }
    } 


    async remove(id: number) {
      try {
        const hapusProject=await this.prisma.project.delete({
          where:{id_project:id}, 
        });
        if(!hapusProject){
          throw new NotFoundException('project tidak ditemukan')
        } return{message: 'project berhasil di hapus'}
      } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError && error.code==='P2025') {
          throw new NotFoundException('project tidak dapat ditemukan')
        }
        throw error;
      }
    }
}
