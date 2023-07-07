import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @Length(2, 45)
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
