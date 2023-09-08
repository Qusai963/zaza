import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CanUserGetOrderGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const orderId = +request.params.id;
    const userId = +request.user.sub;

    const user = await this.userService.findById(userId);
    if (user.userName === 'admin') return true;

    const order = await this.orderRepository.findOneBy({ id: orderId, userId });

    if (order) return true;

    throw new ForbiddenException('It is not your order');
  }
}
