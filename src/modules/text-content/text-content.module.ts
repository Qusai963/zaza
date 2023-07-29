import { Module } from '@nestjs/common';
import { TextContentService } from './text-content.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContent } from './entities/text-content.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageService } from '../language/language.service';

@Module({
  imports: [TypeOrmModule.forFeature([TextContent, Language])],
  providers: [TextContentService, LanguageService],
})
export class TextContentModule {}
