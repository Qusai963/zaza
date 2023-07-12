import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';

export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  readonly categoryId: number;

  @IsNotEmpty()
  readonly textContent: CreateTextContentDto;

  @IsOptional()
  @IsArray()
  readonly translation: SecondCreateTranslationDto[];
}
