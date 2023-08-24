import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  productUnitId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  amount: number;
}
