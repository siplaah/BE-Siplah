/* eslint-disable prettier/prettier */

import { IsString } from "class-validator";

export class CreateJabatanDto {
    @IsString()
    name_jabatan: string;
}
