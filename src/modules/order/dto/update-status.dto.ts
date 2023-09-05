import { IsEnum, IsNotEmpty } from 'class-validator';
import { StatusEnum } from '../helpers/status-enum';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
