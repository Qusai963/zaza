import { IsNotEmpty, Length } from 'class-validator';

export class CreateTextContentDto {
  @IsNotEmpty()
  @Length(2, 45)
  originalText: string;

  @IsNotEmpty()
  @Length(2, 5)
  code: string;
}
