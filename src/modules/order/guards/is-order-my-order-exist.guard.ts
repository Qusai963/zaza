import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { getUserId } from 'src/modules/user/helper/get-user-id.helper';
@Injectable()
export class IsOrderMyOrderGuard implements CanActivate {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    let id = request.params.id;
    let userId = getUserId(request);

    const order = await this.orderRepository.findOneBy({ id, userId });

    if (!order) throw new ForbiddenException('It is not your order');
    return true;
  }
}
