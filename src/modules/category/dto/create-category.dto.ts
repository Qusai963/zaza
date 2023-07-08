import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  categoryId: number;
  @IsNotEmpty()
  textContentId: number;
  number: number;
}
