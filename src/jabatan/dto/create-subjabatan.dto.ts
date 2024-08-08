import { IsNotEmpty } from "class-validator";

export class CreateJabatanDto {
    @IsNotEmpty()
    name_subjabatan: string;
}
