import { IsNotEmpty, Length } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  @Length(2, 5)
  code: string;

  @IsNotEmpty()
  @Length(2, 45)
  name: string;
}
