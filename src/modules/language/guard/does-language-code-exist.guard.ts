import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { LanguageService } from '../language.service';

@Injectable()
export class DoesLanguageCodeExistGuard implements CanActivate {
  constructor(private readonly languageService: LanguageService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const code = request.body.code;

    const isCodeExist = await this.languageService.findByCode(code);
    if (!isCodeExist) throw new BadRequestException();

    return true;
  }
}
