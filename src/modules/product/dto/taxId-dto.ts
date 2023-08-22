import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaxIdDto {
  @IsNotEmpty()
  @IsNumber()
  readonly taxId: number;
}
