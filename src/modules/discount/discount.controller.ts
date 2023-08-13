import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Query,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { AreProductsExistGuard } from '../product/guards/are-products-exist.guard';
import { Pagination } from 'src/core/query/pagination.query';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(AuthGuard, IsAdminGuard, AreProductsExistGuard)
  @Post()
  create(
    @Body('createDiscountDtoList') createDiscountDtoList: CreateDiscountDto[],
  ) {
    return this.discountService.create(createDiscountDtoList);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: Pagination) {
    return this.discountService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.update(+id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountService.remove(+id);
  }
}
