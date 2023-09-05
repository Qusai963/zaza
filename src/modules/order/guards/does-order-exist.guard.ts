import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
@Injectable()
export class DoesOrderExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    let id = request.params.id;

    const order = await this.orderRepository.findOneBy({ id });

    if (!order) throw new NotFoundException('Order not found');
    return true;
  }
}
