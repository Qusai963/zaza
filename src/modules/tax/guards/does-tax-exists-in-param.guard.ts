import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { TaxService } from '../tax.service';

@Injectable()
export class DoesTaxExistInParamGuard implements CanActivate {
  constructor(private readonly taxService: TaxService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const id = request.params.id;

    const tax = await this.taxService.findOne(+id);

    if (!tax) throw new NotFoundException('Tax not found');

    return true;
  }
}
