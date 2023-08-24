import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PRODUCT_UNIT_NOT_FOUND } from 'src/core/error/messages/product-unit-not-found.message';
import { ProductUnitService } from '../product-unit.service';
import { QUANTITY_NOT_ENOUGH } from 'src/core/error/messages/quantity-not-enough.message';

@Injectable()
export class ValidProductUnitsGuard implements CanActivate {
  constructor(
    private readonly productUnitService: ProductUnitService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const productUnitList = request.body;
    const language = getLanguageFromRequest(this.request);

    if (productUnitList.length < 1) {
      return false;
    }

    await Promise.all(
      productUnitList.map(async (createProductUnit) => {
        const productUnitId = createProductUnit.productUnitId;
        const amount = createProductUnit.amount;
        const productUnit = await this.productUnitService.findOne(
          +productUnitId,
        );
        if (!productUnit) {
          throw new NotFoundException(
            PRODUCT_UNIT_NOT_FOUND.getMessage(language),
          );
        }
        if (productUnit.quantity < amount) {
          throw new ForbiddenException(
            QUANTITY_NOT_ENOUGH.getMessage(language),
          );
        }
      }),
    );

    return true;
  }
}
