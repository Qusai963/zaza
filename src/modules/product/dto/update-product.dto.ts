import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly barcode: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly parentCategoryId: number;
}
