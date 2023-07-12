import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  textContentId: number;

  @IsOptional()
  @IsNumber()
  number: number;
}
