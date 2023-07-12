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

    let code = request.body.code;

    const doesCodeExist = await this.languageService.findByCode(code);
    if (!doesCodeExist)
      throw new BadRequestException('Language code does not exist');

    return true;
  }
}
