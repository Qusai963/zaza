import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { dataSourceOptions } from 'db/data-source';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TaxModule } from './modules/tax/tax.module';
import { ImagesModule } from './modules/images/images.module';
import { AdminModule } from './modules/admin/admin.module';
import { UnitModule } from './modules/unit/unit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LanguageModule,
    TextContentModule,
    CategoryModule,
    ProductModule,
    OrderModule,
    ImagesModule,
    PhoneModule,
    FavoriteProductModule,
    ProductOrderModule,
    DiscountModule,
    TranslationModule,
    DiscountSpecificUserModule,
    AuthModule,
    TaxModule,
    MulterModule.register({
      dest: './uploads',
    }),
    AdminModule,
    UnitModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
