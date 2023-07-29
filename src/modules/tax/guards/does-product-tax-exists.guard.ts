import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TaxService } from '../tax.service';

@Injectable()
export class DoesProductTaxExistGuard implements CanActivate {
  constructor(private readonly taxService: TaxService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const taxId = request.body.product.taxId;

    const tax = await this.taxService.findOne(+taxId);

    if (tax) return true;

    throw new NotFoundException('Tax not found');
  }
}
