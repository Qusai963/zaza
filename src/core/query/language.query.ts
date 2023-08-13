import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsString } from 'class-validator';
export class LanguageQuery {
  @ApiProperty({ required: true, default: 'de' })
  @IsString()
  @IsDefined()
  @IsEnum(['en', 'de', 'ar'])
  language: string;
}
