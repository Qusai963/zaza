import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  textContentId?: number;

  @IsString()
  @IsNotEmpty()
  translation: string;
}

export class SecondCreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  translation: string;
}
