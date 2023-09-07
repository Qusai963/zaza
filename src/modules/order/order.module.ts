import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ProductOrder } from '../product-order/entities/product-order.entity';
import { ProductOrderService } from '../product-order/product-order.service';
import { ProductUnitService } from '../product-unit/product-unit.service';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';
import { DiscountService } from '../discount/discount.service';
import { Discount } from '../discount/entities/discount.entity';
import { Product } from '../product/entities/product.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';
import { CanUserGetOrderGuard } from './guards/can-user-get-order-exist.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { IsOrderMyOrderGuard } from './guards/is-order-my-order-exist.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      ProductOrder,
      ProductUnit,
      TextContent,
      Translation,
      Discount,
      Product,
      DiscountSpecificUser,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    ProductUnitService,
    JwtService,
    UserService,
    ProductOrderService,
    TextContentService,
    TranslationService,
    DiscountService,
    IsAdminGuard,
    CanUserGetOrderGuard,
    IsOrderMyOrderGuard,
  ],
})
export class OrderModule {}
