import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { Module } from '@nestjs/common';
import { DiscountSpecificUserService } from './discount-specific-user.service';
import { DiscountSpecificUserController } from './discount-specific-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ProductService } from '../product/product.service';
import { Discount } from '../discount/entities/discount.entity';
import { Category } from '../category/entities/category.entity';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { FavoriteProductService } from '../favorite-product/favorite-product.service';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DiscountSpecificUser,
      User,
      Product,
      Discount,
      Category,
      ProductUnit,
      FavoriteProduct,
    ]),
  ],
  controllers: [DiscountSpecificUserController],
  providers: [
    DiscountSpecificUserService,
    UserService,
    JwtService,
    ProductService,
    FavoriteProductService,
  ],
})
export class DiscountSpecificUserModule {}
