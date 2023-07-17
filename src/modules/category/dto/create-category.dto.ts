import { IsNumber, IsOptional } from 'class-validator';
export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  readonly categoryId: number;
}
