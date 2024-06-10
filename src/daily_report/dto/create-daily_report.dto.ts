import{Progres, Status} from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
export class CreateDailyReportDto {
    
    date: string;
    @IsString()
    task: string;
    
    @IsEnum(Progres, {message: 'Status tidak valid'})
    status: Progres;

    @IsString()
    link: string;

}