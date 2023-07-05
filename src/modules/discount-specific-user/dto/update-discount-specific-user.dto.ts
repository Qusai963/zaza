import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscountSpecificUserDto } from './create-discount-specific-user.dto';

export class UpdateDiscountSpecificUserDto extends PartialType(CreateDiscountSpecificUserDto) {}
