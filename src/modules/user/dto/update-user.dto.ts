import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 45)
  readonly name: string;

  @IsOptional()
  @IsString()
  @Length(2, 45)
  readonly userName: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email: string;
}
