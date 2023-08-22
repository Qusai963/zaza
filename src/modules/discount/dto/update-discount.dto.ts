import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountDto } from './create-discount.dto';
import { IsDefined, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class UpdateDiscountDto {
  @IsNotEmpty()
  @IsNumber()
  @IsDefined()
  @Min(0.1)
  @Max(100)
  readonly percent: number;
}
