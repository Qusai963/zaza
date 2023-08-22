import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CATEGORY_NOT_FOUND } from 'src/core/error/messages/category-not-found.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { CategoryService } from '../category.service';
import { CategoryTypeEnum } from '../constants/category-enum';

@Injectable()
export class DoesCategorySafeForProductsGuard implements CanActivate {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly categoryService: CategoryService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const parentCategoryId = request.body.product.parentCategoryId;
    const language = getLanguageFromRequest(request);
    const category = await this.categoryService.findOne(+parentCategoryId);

    if (!category)
      throw new NotFoundException(CATEGORY_NOT_FOUND.getMessage(language));

    if (category.typeName === CategoryTypeEnum.NODE)
      throw new ForbiddenException('Category is a node');

    if (category.typeName === CategoryTypeEnum.UNKNOWN) {
      category.typeName = CategoryTypeEnum.LEAF;
      await this.categoryRepository.save(category);
    }

    return true;
  }
}
