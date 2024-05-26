import { PartialType } from '@nestjs/mapped-types';
import { CreateKeyResultDto } from './create-key_result.dto';

export class UpdateKeyResultDto extends PartialType(CreateKeyResultDto) {}
