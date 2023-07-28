import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CATEGORY_NOT_FOUND } from 'src/core/error/messages/category-not-found.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { CategoryService } from '../category.service';

@Injectable()
export class DoesCategoryExistGuard implements CanActivate {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private request: Request,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const id = request.params.id;
    const language = getLanguageFromRequest(this.request);

    const category = await this.categoryService.findOne(+id);

    if (!category)
      throw new NotFoundException(CATEGORY_NOT_FOUND.getMessage(language));

    return true;
  }
}
