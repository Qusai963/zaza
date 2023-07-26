import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../entities/admin.entity';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const userId = +request.user.sub;

    const isSuperAdmin = await this.adminRepository.findOneBy({ userId });

    if (!isSuperAdmin) throw new ForbiddenException('you are not an admin.');

    return true;
  }
}
