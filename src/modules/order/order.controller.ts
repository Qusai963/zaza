import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ProductOrderService } from '../product-order/product-order.service';
import { getUserId } from '../user/helper/get-user-id.helper';
import { Request } from 'express';
import { CreateProductOrderDto } from '../product-order/dto/create-product-order.dto';
import { ValidProductUnitsGuard } from '../product-unit/guards/valid-product-units.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

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

  @UseGuards(AuthGuard, ValidProductUnitsGuard)
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
    const productOrderIds: number[] = [];
    productOrders.forEach((productOrder) => {
      productOrderIds.push(productOrder.id);
    });

    const calcTotalPrice = await this.productOrderRepository
      .createQueryBuilder('productOrder')
      .leftJoinAndSelect('productOrder.productUnit', 'productUnit')
      .where('productOrder.id IN (:...productOrderIds)', { productOrderIds }) // Use spread operator for array
      .select('SUM(productOrder.amount * productUnit.price)', 'totalPrice') // Closing parenthesis added
      .getRawOne(); // Use getRawOne() to get a single result as an object

    order.totalPrice = calcTotalPrice.totalPrice;

    return this.orderRepository.save(order);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
