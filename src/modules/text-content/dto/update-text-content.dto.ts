import { PartialType } from '@nestjs/mapped-types';
import { CreateTextContentDto } from './create-text-content.dto';

export class UpdateTextContentDto extends PartialType(CreateTextContentDto) {}
