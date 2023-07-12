import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';
import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
import { CreateProductDto } from './create-product.dto';

export class ProductDto {
  @IsNotEmpty()
  readonly product: CreateProductDto;

  @IsNotEmpty()
  readonly textContent: CreateTextContentDto;

  @IsOptional()
  @IsArray()
  readonly translation: SecondCreateTranslationDto[];
}
