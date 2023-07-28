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
import { CATEGORY_NOT_FOUND } from 'src/core/error/messages/category-not-found.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { CategoryTypeEnum } from '../constants/category-enum';

@Injectable()
export class DoesParentCategorySafeForCategoriesGuard implements CanActivate {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(REQUEST) private request: Request,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const parentCategoryId = request.body.parentCategoryId;
    const language = getLanguageFromRequest(this.request);

    if (!parentCategoryId) return true;

    const parentCategory = await this.categoryRepository.findOneBy({
      id: parentCategoryId,
    });

    if (!parentCategory)
      throw new NotFoundException(CATEGORY_NOT_FOUND.getMessage(language));

    if (parentCategory.typeName === CategoryTypeEnum.LEAF)
      throw new NotFoundException('Invalid category');

    parentCategory.typeName = CategoryTypeEnum.NODE;
    await this.categoryRepository.save(parentCategory);
    return true;
  }
}
