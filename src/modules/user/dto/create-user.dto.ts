import { IsArray, IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 45)
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 45)
  readonly userName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  readonly password: string;

  @IsArray()
  phoneNumbers: string[];
}
