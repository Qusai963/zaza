import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { FavoriteProductService } from './favorite-product.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DoesProductExistGuard } from '../product/guards/does-product-exist.guard';
import { getUserId } from '../user/helper/get-user-id.helper';
import { Request } from 'express';

@Controller('favorite-product')
export class FavoriteProductController {
  constructor(
    private readonly favoriteProductService: FavoriteProductService,
  ) {}

  @UseGuards(AuthGuard, DoesProductExistGuard)
  @Post(':id')
  create(@Param('id') productId: number, @Req() req: Request) {
    const userId = getUserId(req);
    return this.favoriteProductService.create(userId, +productId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const userId = getUserId(req);
    return this.favoriteProductService.findAllByUserId(userId);
  }
}
