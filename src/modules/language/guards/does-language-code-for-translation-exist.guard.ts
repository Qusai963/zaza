import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Language } from '../entities/language.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DoesLanguageCodeForTranslationExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    let translations = request.body.translation;

    const code = [];
    for (const translation of translations) {
      code.push(translation.code);
    }
    const codeCount = await this.languageRepository.count({
      where: {
        code: In(code),
      },
    });
    if (codeCount != code.length)
      throw new BadRequestException('Language code in translation does not exist');

    return true;
  }
}
