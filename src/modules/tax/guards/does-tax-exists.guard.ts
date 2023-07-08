import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tax } from '../entities/tax.entity';

@Injectable()
export class DoesTaxExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepository: Repository<Tax>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const taxId = request.body.taxId;

    const tax = await this.taxRepository.findOneBy({
      id: taxId,
    });

    if (tax) return true;

    throw new NotFoundException('Tax not found');
  }
}
