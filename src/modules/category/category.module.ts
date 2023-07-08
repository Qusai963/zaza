import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TextContent } from '../text-content/entities/text-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, TextContent])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
