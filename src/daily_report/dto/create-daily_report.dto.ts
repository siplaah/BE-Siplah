import{Progres, Project} from '@prisma/client';
import { IsEnum, IsString, IsNotEmpty, IsNumber, IsInt} from 'class-validator';
export class CreateDailyReportDto {
    @IsNotEmpty()
    @IsString()
    date: Date;
    
    @IsNotEmpty()
    @IsString()
    task: string;
    
    @IsNotEmpty()
    @IsEnum(Progres, {message: 'Status tidak valid'})
    status: Progres;

    @IsString()
    link: string;

    @IsInt()
  id_project: number;

}