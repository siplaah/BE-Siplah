/* eslint-disable prettier/prettier */

import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateJabatanDto {
    @IsString()
    name_jabatan: string;

    @IsOptional()
    @IsInt()
    parentId?: number;
}
