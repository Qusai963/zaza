import { Pagination } from './../../core/query/pagination.query';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DiscountSpecificUserService } from './discount-specific-user.service';
import { CreateDiscountSpecificUserDto } from './dto/create-discount-specific-user.dto';
import { UpdateDiscountSpecificUserDto } from './dto/update-discount-specific-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { UserNotFoundGuard } from '../user/guards/user-not-found.guard';
import { AreProductsExistGuard } from '../product/guards/are-products-exist.guard';
import { DoesDiscountSpecificUserExistGuard } from './guards/does-discount-exist.guard';

@Controller('discount-specific-user')
export class DiscountSpecificUserController {
  constructor(
    private readonly discountSpecificUserService: DiscountSpecificUserService,
  ) {}

  @UseGuards(AuthGuard, IsAdminGuard, UserNotFoundGuard, AreProductsExistGuard)
  @Post(':id')
  create(
    @Body('createDiscountDtoList')
    createDiscountSpecificUserDtoList: CreateDiscountSpecificUserDto[],
    @Param('id') userId: number,
  ) {
    return this.discountSpecificUserService.create(
      createDiscountSpecificUserDtoList,
      +userId,
    );
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Get()
  findAll(@Query() pagination: Pagination) {
    return this.discountSpecificUserService.findAll(pagination);
  }

  @UseGuards(AuthGuard, IsAdminGuard, UserNotFoundGuard)
  @Get('user/:id')
  findByUserId(@Param('id') id: number) {
    return this.discountSpecificUserService.findByUserId(+id);
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesDiscountSpecificUserExistGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateDiscountSpecificUserDto: UpdateDiscountSpecificUserDto,
  ) {
    return this.discountSpecificUserService.update(
      +id,
      updateDiscountSpecificUserDto,
    );
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesDiscountSpecificUserExistGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.discountSpecificUserService.remove(+id);
  }
}
