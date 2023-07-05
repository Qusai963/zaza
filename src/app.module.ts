import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { LanguageModule } from './modules/language/language.module';
import { TextContentModule } from './modules/text-content/text-content.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { PhoneModule } from './modules/phone/phone.module';
import { FavoriteProductModule } from './modules/favorite-product/favorite-product.module';
import { ProductOrderModule } from './modules/product-order/product-order.module';
import { DiscountModule } from './modules/discount/discount.module';
import { TranslationModule } from './modules/translation/translation.module';
import { DiscountSpecificUserModule } from './modules/discount-specific-user/discount-specific-user.module';

@Module({
  imports: [UserModule, LanguageModule, TextContentModule, CategoryModule, ProductModule, OrderModule, PhoneModule, FavoriteProductModule, ProductOrderModule, DiscountModule, TranslationModule, DiscountSpecificUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
