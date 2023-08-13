import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ProductService } from '../product.service';
import { PRODUCT_NOT_FOUND } from 'src/core/error/messages/product-not-found.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class DoesProductExistGuard implements CanActivate {
  constructor(
    private readonly productService: ProductService,
    @Inject(REQUEST) private request: Request,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const language = getLanguageFromRequest(this.request);

    const product = await this.productService.findOne(+id);
    if (!product)
      throw new NotFoundException(PRODUCT_NOT_FOUND.getMessage(language));

    return true;
  }
}
