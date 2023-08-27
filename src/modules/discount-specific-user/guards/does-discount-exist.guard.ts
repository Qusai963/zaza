import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { DiscountSpecificUserService } from '../discount-specific-user.service';

@Injectable()
export class DoesDiscountSpecificUserExistGuard implements CanActivate {
  constructor(
    private readonly discountSpecificUserService: DiscountSpecificUserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const discountId = request.params.id;

    if (!discountId) return false;

    const discount = await this.discountSpecificUserService.findOneById(
      +discountId,
    );

    if (!discount) throw new NotFoundException();

    return true;
  }
}
