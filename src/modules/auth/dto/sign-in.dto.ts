import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
