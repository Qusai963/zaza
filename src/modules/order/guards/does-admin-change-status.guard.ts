import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { StatusEnum } from '../helpers/status-enum';
@Injectable()
export class DoesAdminChangeStatusExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    let id = request.params.id;

    const order = await this.orderRepository.findOneBy({ id });

    if (order.status != StatusEnum.PENDING)
      throw new ForbiddenException('Status already Changed');
    return true;
  }
}
