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
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { catchingError } from 'src/core/error/helper/catching-error';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DoesTextContentExistGuard } from '../text-content/guards/text-content-exists.guard';
import { DoesTaxExistGuard } from '../tax/guards/does-tax-exists.guard';
import { DoesCategoryExistGuard } from '../category/guards/does-category-exists.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @UseGuards(
    DoesTextContentExistGuard,
    DoesTaxExistGuard,
    DoesCategoryExistGuard,
  )
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productService.create(createProductDto);
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
