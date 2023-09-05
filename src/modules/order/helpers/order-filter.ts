import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from './status-enum';

export class OrderFilter {
  @IsOptional()
  @IsString()
  @IsEnum(StatusEnum)
  status: string;
}
