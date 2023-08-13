import { Module } from '@nestjs/common';
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

@Module({
  imports: [TypeOrmModule.forFeature([Discount, User, Product, ProductUnit])],
  controllers: [DiscountController],
  providers: [DiscountService, JwtService, UserService, ProductService],
})
export class DiscountModule {}
