import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from 'src/modules/unit/entities/unit.entity';

@Injectable()
export class DoesUnitIdForProductUnitExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    let units = request.body.productUnit;

    const id = [];
    for (const unit of units) {
      id.push(unit.unitId);
    }
    const idCount = await this.unitRepository.count({
      where: {
        id: In(id),
      },
    });
    if (idCount != id.length)
      throw new BadRequestException('Unit does not exist');

    return true;
  }
}
