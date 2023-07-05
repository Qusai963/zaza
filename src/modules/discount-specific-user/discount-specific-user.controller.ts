import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscountSpecificUserService } from './discount-specific-user.service';
import { CreateDiscountSpecificUserDto } from './dto/create-discount-specific-user.dto';
import { UpdateDiscountSpecificUserDto } from './dto/update-discount-specific-user.dto';

@Controller('discount-specific-user')
export class DiscountSpecificUserController {
  constructor(private readonly discountSpecificUserService: DiscountSpecificUserService) {}

  @Post()
  create(@Body() createDiscountSpecificUserDto: CreateDiscountSpecificUserDto) {
    return this.discountSpecificUserService.create(createDiscountSpecificUserDto);
  }

  @Get()
  findAll() {
    return this.discountSpecificUserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountSpecificUserService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscountSpecificUserDto: UpdateDiscountSpecificUserDto) {
    return this.discountSpecificUserService.update(+id, updateDiscountSpecificUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountSpecificUserService.remove(+id);
  }
}
