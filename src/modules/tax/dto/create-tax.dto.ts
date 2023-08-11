import { IsArray, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTaxDto {
  @IsNotEmpty()
  @Min(0.1)
  readonly percent: number;
}
