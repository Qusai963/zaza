import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class TaxIdDto {
  @IsOptional()
  @IsNumber()
  readonly taxId: number;
}
