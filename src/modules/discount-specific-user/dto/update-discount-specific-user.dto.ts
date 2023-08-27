import { IsDefined, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateDiscountSpecificUserDto {
  @IsNotEmpty()
  @IsDefined()
  @IsNumber()
  @Min(0)
  @Max(100)
  percent: number;
}
