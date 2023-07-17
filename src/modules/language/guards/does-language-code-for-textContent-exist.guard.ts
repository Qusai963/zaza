import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { LanguageService } from '../language.service';

@Injectable()
export class DoesLanguageCodeForTextContentExistGuard implements CanActivate {
  constructor(private readonly languageService: LanguageService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const textContent = request.body.textContent;

    if (!textContent || !textContent.code) {
      throw new BadRequestException('Invalid textContent provided');
    }

    const code = textContent.code;
    const foundTextContent = await this.languageService.findByCode(code);

    if (!foundTextContent) {
      throw new BadRequestException('Language code in textContent does not exist');
    }

    return true;
  }
}
