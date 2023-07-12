import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTextContentDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 45)
  originalText: string;

  @IsNotEmpty()
  @Length(2, 5)
  code: string;
}
