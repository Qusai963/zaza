import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Tax } from '../tax/entities/tax.entity';
import { Category } from '../category/entities/category.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageService } from '../language/language.service';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { Translation } from '../translation/entities/translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      TextContent,
      Tax,
      Category,
      Language,
      Translation,
    ]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    LanguageService,
    TextContentService,
    TranslationService,
  ],
})
export class ProductModule {}
