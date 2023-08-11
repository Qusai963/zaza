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
  @Min(1)
  readonly quantityInStock: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly price: number;

  @IsOptional()
  @IsString()
  readonly barcode: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly parentCategoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly taxId: number;
}
