import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';

export class CreateProductUnitDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly unitId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly quantity: number;

  @IsNotEmpty()
  readonly textContent: CreateTextContentDto;

  @IsNotEmpty()
  readonly translation: SecondCreateTranslationDto[];
}
