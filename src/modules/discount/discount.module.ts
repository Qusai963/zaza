import { Global, Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { Category } from '../category/entities/category.entity';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';
import { FavoriteProductService } from '../favorite-product/favorite-product.service';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Discount,
      User,
      Product,
      ProductUnit,
      Category,
      FavoriteProduct,
      DiscountSpecificUser,
    ]),
  ],
  controllers: [DiscountController],
  providers: [
    DiscountService,
    JwtService,
    UserService,
    ProductService,
    FavoriteProductService,
  ],
  exports: [DiscountService],
})
export class DiscountModule {}
