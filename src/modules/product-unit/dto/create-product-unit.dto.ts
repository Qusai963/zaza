import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { CreateTextContentDto } from 'src/modules/text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from 'src/modules/translation/dto/create-translation.dto';

export class CreateProductUnitDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  unitId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  textContent: CreateTextContentDto;

  @IsNotEmpty()
  translation: SecondCreateTranslationDto[];
}
