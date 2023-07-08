import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Tax } from '../tax/entities/tax.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, TextContent, Tax, Category])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
