import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageService } from '../language/language.service';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, TextContent, Language])],
  providers: [TranslationService, LanguageService],
})
export class TranslationModule {}
