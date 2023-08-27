import { IsDefined, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateDiscountSpecificUserDto {
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;

  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @Min(1)
  productId: number;
}
