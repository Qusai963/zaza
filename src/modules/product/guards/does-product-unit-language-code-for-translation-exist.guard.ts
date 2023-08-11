import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/modules/language/entities/language.entity';

@Injectable()
export class DoesProductUnitLanguageCodeForTranslationExistGuard
  implements CanActivate
{
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const productUnits = request.body.productUnit;

    for (const productUnit of productUnits) {
      let translations = productUnit.translation;

      const code = [];
      for (const translation of translations) {
        if (!translation.translation)
          throw new BadRequestException('translation is empty');
        code.push(translation.code);
      }
      const codeCount = await this.languageRepository.count({
        where: {
          code: In(code),
        },
      });
      if (codeCount != code.length)
        throw new BadRequestException(
          'Language code in product unit translation does not exist',
        );
    }
    return true;
  }
}
