import { PartialType } from '@nestjs/mapped-types';
import { CreateTranslationDto, SecondCreateTranslationDto } from './create-translation.dto';

export class UpdateTranslationDto extends PartialType(CreateTranslationDto) {}

export class UpdateSecondTranslationDtoList extends PartialType(SecondCreateTranslationDto) {}
