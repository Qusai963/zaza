import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { DiscountService } from '../discount.service';
import { DISCOUNT_NOT_FOUND } from 'src/core/error/messages/discount-not-found.message';

@Injectable()
export class DoesDiscountExistGuard implements CanActivate {
  constructor(
    private readonly discountService: DiscountService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const discountId = request.params.id;
    const language = getLanguageFromRequest(this.request);

    if (!discountId) return true;

    const discount = await this.discountService.findOne(+discountId);

    if (!discount)
      throw new NotFoundException(DISCOUNT_NOT_FOUND.getMessage(language));

    return true;
  }
}
