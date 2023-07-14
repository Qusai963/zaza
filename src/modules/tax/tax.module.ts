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

@Module({
  imports: [
    TypeOrmModule.forFeature([Tax, TextContent, Translation, Language]),
  ],
  controllers: [TaxController],
  providers: [
    TaxService,
    TranslationService,
    TextContentService,
    LanguageService,
  ],
})
export class TaxModule {}
