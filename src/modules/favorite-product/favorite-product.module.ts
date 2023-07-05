import { Module } from '@nestjs/common';
import { FavoriteProductService } from './favorite-product.service';
import { FavoriteProductController } from './favorite-product.controller';

@Module({
  controllers: [FavoriteProductController],
  providers: [FavoriteProductService]
})
export class FavoriteProductModule {}
