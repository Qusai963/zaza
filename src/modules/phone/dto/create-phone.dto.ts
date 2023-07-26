import { IsNotEmpty } from 'class-validator';

export class CreatePhoneDto {
  @IsNotEmpty()
  number: string;

  @IsNotEmpty()
  code: string;
}

export class CreateMultiPhoneDto {
  @IsNotEmpty()
  phoneNumbers: CreatePhoneDto[];
}
