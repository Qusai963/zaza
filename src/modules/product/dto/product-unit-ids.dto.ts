import { IsNotEmpty, IsArray } from 'class-validator';

export class ProductUnitIds {
  @IsNotEmpty()
  @IsArray()
  readonly productUnitIds: number[];
}
