import {
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';
import { CreateTaxDto } from './create-tax.dto';

export class TaxDto {
  @IsNotEmpty()
  readonly tax: CreateTaxDto;

  @IsNotEmpty()
  readonly textContent: CreateTextContentDto;

  @IsOptional()
  @IsArray()
  readonly translation: SecondCreateTranslationDto[];
}
