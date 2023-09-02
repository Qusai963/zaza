import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TaxService } from '../tax.service';

@Injectable()
export class DoesTaxExistInBodyGuard implements CanActivate {
  constructor(private readonly taxService: TaxService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const taxId = request.body.taxId;

    const tax = await this.taxService.findOne(+taxId);

    if (tax || !taxId) return true;

    throw new NotFoundException('Tax not found');
  }
}
