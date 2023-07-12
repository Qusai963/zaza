import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { LanguageService } from '../language.service';

@Injectable()
export class DoesLanguageCodeForTextContentExistGuard implements CanActivate {
  constructor(private readonly languageService: LanguageService) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const code = request.body.textContent.code;

    const textContent = await this.languageService.findByCode(code);

    if (!textContent)
      throw new BadRequestException('Language code in textContent does not exist');

    return true;
  }
}
