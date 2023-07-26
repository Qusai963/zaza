import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class IsAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const userId = +request.user.sub;

    const user = await this.userService.findById(userId);

    if (user.userName === 'admin')
      throw new ForbiddenException('you are not an admin.');

    return true;
  }
}
