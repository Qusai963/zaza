import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';
import { TranslationService } from '../translation/translation.service';
import { TextContentService } from '../text-content/text-content.service';
import { LanguageService } from '../language/language.service';
import { Language } from '../language/entities/language.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { Category } from '../category/entities/category.entity';
import { Discount } from '../discount/entities/discount.entity';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';
import { UserResetPassword } from '../user/entities/user-reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tax,
      TextContent,
      Translation,
      Language,
      User,
      Product,
      ProductUnit,
      Category,
      Discount,
      FavoriteProduct,
      DiscountSpecificUser,
      UserResetPassword,
    ]),
  ],
  controllers: [TaxController],
  providers: [
    TaxService,
    TranslationService,
    TextContentService,
    LanguageService,
    UserService,
    JwtService,
    ProductService,
  ],
})
export class TaxModule {}
