import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitController } from './unit.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Unit } from './entities/unit.entity';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageService } from '../language/language.service';
import { ProductUnitModule } from '../product-unit/product-unit.module';
import { ProductUnitService } from '../product-unit/product-unit.service';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { UserResetPassword } from '../user/entities/user-reset-password.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Unit,
      TextContent,
      Translation,
      Language,
      ProductUnit,
      UserResetPassword,
    ]),
    ProductUnitModule,
  ],
  controllers: [UnitController],
  providers: [
    UnitService,
    JwtService,
    UserService,
    TextContentService,
    TranslationService,
    LanguageService,
    ProductUnitService,
  ],
})
export class UnitModule {}
