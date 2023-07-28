import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { UnitService } from '../unit.service';

@Injectable()
export class DoesUnitExistGuard implements CanActivate {
  constructor(private readonly unitService: UnitService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const id = request.params.id;
    const unit = await this.unitService.findOne(+id);
    if (unit) return true;

    throw new NotFoundException('Unit not found');
  }
}
