import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CATEGORY_DOES_NOT_EXISTS } from 'src/core/error/messages/category-doesnot-exists.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';

@Injectable()
export class DoesProductCategoryExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const categoryId = request.body.product.categoryId;
    const language = getLanguageFromRequest(this.request);

    if (
      !categoryId ||
      (await this.categoryRepository.findOneBy({ id: categoryId }))
    )
      return true;

    throw new NotFoundException(CATEGORY_DOES_NOT_EXISTS.getMessage(language));
  }
}
