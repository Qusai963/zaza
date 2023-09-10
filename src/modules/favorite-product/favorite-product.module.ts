import { User } from 'src/modules/user/entities/user.entity';
import { Module, Global } from '@nestjs/common';
import { FavoriteProductService } from './favorite-product.service';
import { FavoriteProductController } from './favorite-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { Product } from '../product/entities/product.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { Discount } from '../discount/entities/discount.entity';
import { Category } from '../category/entities/category.entity';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';
import { UserResetPassword } from '../user/entities/user-reset-password.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      FavoriteProduct,
      Product,
      User,
      Discount,
      Category,
      ProductUnit,
      DiscountSpecificUser,
      UserResetPassword,
    ]),
    ProductModule,
  ],
  controllers: [FavoriteProductController],
  providers: [FavoriteProductService, JwtService, UserService, ProductService],
  exports: [FavoriteProductService],
})
export class FavoriteProductModule {}
