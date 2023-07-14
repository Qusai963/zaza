import { IsArray, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateTaxDto {
  @IsNotEmpty()
  @Min(0.1)
  @Max(99.99)
  readonly percent: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
