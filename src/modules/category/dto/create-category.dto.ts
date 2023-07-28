import { IsNumber, IsOptional, Min } from 'class-validator';
export class CreateCategoryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly parentCategoryId: number;
}
