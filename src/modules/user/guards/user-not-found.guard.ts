import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from '../user.service';
import { USER_NOT_FOUND } from 'src/core/error/messages/user-not-found.message';

@Injectable()
export class UserNotFoundGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const language = getLanguageFromRequest(this.request);
    const user = await this.userService.findById(+id);
    if (!user) throw new NotFoundException(USER_NOT_FOUND.getMessage(language));

    return true;
  }
}
