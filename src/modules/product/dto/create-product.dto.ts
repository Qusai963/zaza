import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsNumber()
  readonly quantity: number;

  @IsOptional()
  @IsString()
  readonly picture: string;

  @IsOptional()
  @IsString() 
  readonly barcode: string;

  @IsNotEmpty()
  @IsNumber()
  readonly categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly textContentId: number;

  @IsNotEmpty()
  @IsNumber()
  readonly taxId: number;
}
