import { IsDefined, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class CreateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  @Min(0.1)
  @Max(100)
  readonly percent: number;

  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  @Min(1)
  readonly productId: number;
}
