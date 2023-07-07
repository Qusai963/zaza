import { Module } from '@nestjs/common';
import { TextContentService } from './text-content.service';
import { TextContentController } from './text-content.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContent } from './entities/text-content.entity';
import { Language } from '../language/entities/language.entity';
import { LanguageService } from '../language/language.service';

@Module({
  imports: [TypeOrmModule.forFeature([TextContent, Language])],
  controllers: [TextContentController],
  providers: [TextContentService, LanguageService],
})
export class TextContentModule {}
