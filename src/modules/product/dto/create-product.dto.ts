import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly quantity: number;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsOptional()
  @IsString()
  readonly barcode: string;

  @IsNotEmpty()
  @IsNumber()
  readonly parentCategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly taxId: number;
}
