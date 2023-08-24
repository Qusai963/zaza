import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { USER_NAME_EXISTS } from 'src/core/error/messages/user-name-exists.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { EMAIL_EXISTS } from 'src/core/error/messages/email-exists.message';

@Injectable()
export class DoesUserExistGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const language = getLanguageFromRequest(request);
    const userName = await this.userService.findByUserName(
      request.body.userName,
    );
    if (userName) {
      throw new ForbiddenException(USER_NAME_EXISTS.getMessage(language));
    }

    const email = await this.userService.findByEmail(request.body.email);
    if (email) {
      throw new ForbiddenException(EMAIL_EXISTS.getMessage(language));
    }
    return true;
  }
}
