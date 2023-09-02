import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { ProductOrderService } from '../product-order/product-order.service';
import { getUserId } from '../user/helper/get-user-id.helper';
import { Request } from 'express';
import { CreateProductOrderDto } from '../product-order/dto/create-product-order.dto';
import { ValidProductUnitsGuard } from '../product-unit/guards/valid-product-units.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { UserNotFoundGuard } from '../user/guards/user-not-found.guard';
import { Pagination } from 'src/core/query/pagination.query';
import { LanguageQuery } from 'src/core/query/language.query';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productOrderService: ProductOrderService,
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  @UseGuards(AccessTokenGuard, ValidProductUnitsGuard)
  @Post()
  async create(
    @Body() createProductOrderDtoList: CreateProductOrderDto[],
    @Req() req: Request,
  ) {
    const userId = getUserId(req);
    const order = await this.orderService.create(userId);

    const productOrders = await this.productOrderService.create(
      createProductOrderDtoList,
      order.id,
    );

    const totalPricePromises = productOrders.map(async (productOrder) => {
      const totalDiscountedPriceQuery = this.productOrderRepository
        .createQueryBuilder('po')
        .leftJoinAndSelect('po.productUnit', 'pu')
        .leftJoinAndSelect('pu.product', 'p')
        .leftJoinAndSelect('p.discounts', 'd')
        .leftJoinAndSelect('p.discountSpecificUsers', 'dsu')
        .where('po.id = :id', { id: productOrder.id })
        .select(
          'po.amount * (pu.price - COALESCE(d.percent / 10, dsu.percent / 10, 0))',
          'discountedPrice',
        )
        .getRawOne();

      const calcTotalDiscountedPrice = await totalDiscountedPriceQuery;
      const discountedPrice = calcTotalDiscountedPrice.discountedPrice;

      productOrder.totalPrice = discountedPrice;
      await this.productOrderRepository.save(productOrder);

      return discountedPrice;
    });

    const discountedPrices = await Promise.all(totalPricePromises);
    const orderTotalPrice = discountedPrices.reduce(
      (total, price) => total + price,
      0,
    );

    order.totalPrice = orderTotalPrice;
    await this.orderRepository.save(order);

    return order;
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard, UserNotFoundGuard)
  @Get('user/:id')
  findAllByUserId(@Param('id') userId: number, @Query() query: Pagination) {
    return this.orderService.findAllByUserId(userId, query);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard)
  @Get()
  findAll(@Query() query: Pagination) {
    return this.orderService.findAll(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get('user')
  findMyOrders(@Query() query: Pagination, @Req() req: Request) {
    const userId = getUserId(req);
    return this.orderService.findMyOrders(userId, query);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query() language: LanguageQuery) {
    return this.orderService.findOne(+id, language);
  }
}
