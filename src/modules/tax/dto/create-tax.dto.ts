import { IsNotEmpty } from 'class-validator';

export class CreateTaxDto {
  @IsNotEmpty()
  percent: number;

  @IsNotEmpty()
  textContentId: number;
}
