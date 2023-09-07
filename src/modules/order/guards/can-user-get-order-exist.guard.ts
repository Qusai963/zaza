import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IsAdminGuard } from 'src/modules/auth/guards/is-admin.guard';
import { IsOrderMyOrderGuard } from './is-order-my-order-exist.guard';
@Injectable()
export class CanUserGetOrderGuard implements CanActivate {
  constructor(
    private readonly isAdminGuard: IsAdminGuard,
    private readonly isOrderMyOrderGuard: IsOrderMyOrderGuard,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      return this.isOrderMyOrderGuard.canActivate(context);
    } catch (error) {
      return this.isAdminGuard.canActivate(context);
    }
  }
}
