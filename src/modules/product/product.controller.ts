import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchingError } from 'src/core/error/helper/catching-error';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DoesProductTaxExistGuard } from '../tax/guards/does-product-tax-exists.guard';
import { DoesLanguageCodeExistGuard } from '../language/guards/does-language-code-exist.guard';
import { ProductDto } from './dto/product.dto';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { DoesProductCategoryExistGuard } from '../category/guards/does-product-category-exists.guard';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @UseGuards(
    DoesProductTaxExistGuard,
    DoesProductCategoryExistGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
  )
  @Post()
  async create(@Body() productDto: ProductDto) {
    try {
      const translation = productDto.translation;
      const textContent = productDto.textContent;
      const product = productDto.product;

      const createdTextContent = await this.textContentService.create(
        textContent,
      );

      await this.translationService.createMany(translation, createdTextContent);

      const createdProduct = await this.productService.create(
        product,
        createdTextContent,
      );

      return { product: createdProduct };
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get()
  findAll() {
    try {
      return this.productService.findAll();
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
