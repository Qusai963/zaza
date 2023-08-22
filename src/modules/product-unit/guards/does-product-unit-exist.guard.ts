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
import { PRODUCT_UNIT_NOT_FOUND } from 'src/core/error/messages/product-unit-not-found.message';
import { ProductUnitService } from '../product-unit.service';

@Injectable()
export class DoesProductUnitExistGuard implements CanActivate {
  constructor(
    private readonly productUnitService: ProductUnitService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const id = request.params.productUnitId;
    const language = getLanguageFromRequest(this.request);

    const productUnit = await this.productUnitService.findOne(+id);
    if (!productUnit)
      throw new NotFoundException(PRODUCT_UNIT_NOT_FOUND.getMessage(language));

    return true;
  }
}
