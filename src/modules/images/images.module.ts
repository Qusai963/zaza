import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MulterModule } from '@nestjs/platform-express';
import { CategoryService } from '../category/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductService } from '../product/product.service';
import { TextContentService } from '../text-content/text-content.service';
import { TextContent } from '../text-content/entities/text-content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, TextContent]),
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [ImagesController],
  providers: [
    ImagesService,
    CategoryService,
    ProductService,
    TextContentService,
  ],
})
export class ImagesModule {}
