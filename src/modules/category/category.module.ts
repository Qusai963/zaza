import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { LanguageService } from '../language/language.service';
import { Language } from '../language/entities/language.entity';
import { ProductService } from '../product/product.service';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      TextContent,
      Translation,
      Language,
      Product,
    ]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    TextContentService,
    TranslationService,
    LanguageService,
    ProductService,
  ],
})
export class CategoryModule {}
