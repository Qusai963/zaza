import { IsNotEmpty } from 'class-validator';

export class CreatePhoneDto {
  @IsNotEmpty()
  phoneNumbers: string[];
}
