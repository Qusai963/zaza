import { IsNumber, Min, IsNotEmpty } from 'class-validator';

export class UpdateProductQuantityDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly quantity: number;
}
