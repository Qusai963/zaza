import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateLanguageDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 5)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 5)
  name: string;
}
