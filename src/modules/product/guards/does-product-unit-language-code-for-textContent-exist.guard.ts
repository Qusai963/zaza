import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { LanguageService } from 'src/modules/language/language.service';

@Injectable()
export class DoesProductUnitLanguageCodeForTextContentExistGuard
  implements CanActivate
{
  constructor(private readonly languageService: LanguageService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const productUnits = request.body.productUnit;

    for (const productUnit of productUnits) {
      const textContent = productUnit.textContent;
      if (!textContent || !textContent.code) {
        throw new BadRequestException(
          'Invalid textContent provided in product unit',
        );
      }

      const code = textContent.code;
      const foundTextContent = await this.languageService.findByCode(code);

      if (!foundTextContent) {
        throw new BadRequestException(
          'Language code in product unit textContent does not exist',
        );
      }
    }

    return true;
  }
}
