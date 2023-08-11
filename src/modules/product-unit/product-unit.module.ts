import { Module } from '@nestjs/common';
import { ProductUnitService } from './product-unit.service';
import { ProductUnitController } from './product-unit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUnit } from './entities/product-unit.entity';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Translation } from '../translation/entities/translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUnit, TextContent, Translation])],
  controllers: [ProductUnitController],
  providers: [ProductUnitService, TextContentService, TranslationService],
})
export class ProductUnitModule {}
