import { Injectable } from '@nestjs/common';
import { CreateDiscountSpecificUserDto } from './dto/create-discount-specific-user.dto';
import { UpdateDiscountSpecificUserDto } from './dto/update-discount-specific-user.dto';

@Injectable()
export class DiscountSpecificUserService {
  create(createDiscountSpecificUserDto: CreateDiscountSpecificUserDto) {
    return 'This action adds a new discountSpecificUser';
  }

  findAll() {
    return `This action returns all discountSpecificUser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discountSpecificUser`;
  }

  update(id: number, updateDiscountSpecificUserDto: UpdateDiscountSpecificUserDto) {
    return `This action updates a #${id} discountSpecificUser`;
  }

  remove(id: number) {
    return `This action removes a #${id} discountSpecificUser`;
  }
}
