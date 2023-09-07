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
  Patch,
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
import { DoesOrderExistGuard } from './guards/does-order-exist.guard';
import { OrderFilter } from './helpers/order-filter';
import { UpdateStatusDto } from './dto/update-status.dto';
import { DoesAdminChangeStatusExistGuard } from './guards/does-admin-change-status.guard';
import { CanUserGetOrderGuard } from './guards/can-user-get-order-exist.guard';

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
      const totalDiscountedPriceQuery = await this.productOrderRepository
        .createQueryBuilder('po')
        .leftJoinAndSelect('po.productUnit', 'pu')
        .leftJoinAndSelect('pu.product', 'p')
        .leftJoinAndSelect('p.discounts', 'd')
        .leftJoinAndSelect('p.discountSpecificUsers', 'dsu')
        .where('po.id = :id', { id: productOrder.id })
        .addSelect(
          `
        CASE
          WHEN d.percent IS NOT NULL AND dsu.percent IS NOT NULL THEN
            po.amount * pu.price * (1 - (d.percent / 100))
          WHEN d.percent IS NOT NULL THEN
            po.amount * pu.price * (1 - (d.percent / 100))
          WHEN dsu.percent IS NOT NULL THEN
            po.amount * pu.price * (1 - (dsu.percent / 100))
          ELSE
            po.amount * pu.price
        END
      `,
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
  findAllByUserId(
    @Param('id') userId: number,
    @Query() filter: OrderFilter,
    @Query() query: Pagination,
  ) {
    return this.orderService.findAllByUserId(userId, query, filter.status);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard)
  @Get()
  findAll(@Query() query: Pagination, @Query() filter: OrderFilter) {
    return this.orderService.findAll(query, filter.status);
  }

  @UseGuards(AccessTokenGuard)
  @Get('user')
  findMyOrders(
    @Query() query: Pagination,
    @Query() filter: OrderFilter,
    @Req() req: Request,
  ) {
    const userId = getUserId(req);
    return this.orderService.findMyOrders(userId, query, filter.status);
  }

  @UseGuards(AccessTokenGuard, DoesOrderExistGuard, CanUserGetOrderGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query() language: LanguageQuery) {
    return this.orderService.findOne(+id, language);
  }

  @UseGuards(
    AccessTokenGuard,
    IsAdminGuard,
    DoesOrderExistGuard,
    DoesAdminChangeStatusExistGuard,
  )
  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.orderService.updateStatus(+id, updateStatusDto);
  }
}
