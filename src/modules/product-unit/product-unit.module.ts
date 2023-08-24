import { Module } from '@nestjs/common';
import { ProductUnitService } from './product-unit.service';
import { ProductUnitController } from './product-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUnit } from './entities/product-unit.entity';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { LanguageService } from '../language/language.service';
import { Language } from '../language/entities/language.entity';
import { Unit } from '../unit/entities/unit.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductUnit,
      TextContent,
      Translation,
      Product,
      User,
      Language,
      Unit,
      Category,
    ]),
  ],
  controllers: [ProductUnitController],
  providers: [
    ProductUnitService,
    TextContentService,
    TranslationService,
    ProductService,
    JwtService,
    UserService,
    LanguageService,
  ],
})
export class ProductUnitModule {}
