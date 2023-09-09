import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryService } from '../category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { TextContentService } from '../text-content/text-content.service';
import { TextContent } from '../text-content/entities/text-content.entity';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { Discount } from '../discount/entities/discount.entity';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      TextContent,
      ProductUnit,
      Discount,
      FavoriteProduct,
      DiscountSpecificUser,
    ]),
    // MulterModule.register({
    //   dest: '../uploads',
    // }),
  ],
  providers: [
    ImagesService,
    CategoryService,
    ProductService,
    TextContentService,
  ],
})
export class ImagesModule {}
