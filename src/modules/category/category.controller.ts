import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DoesCategoryExistGuard } from './guards/does-category-exists.guard';
import { DoesTextContentExistGuard } from '../text-content/guards/text-content-exists.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchingError } from 'src/core/error/helper/catching-error';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @UseGuards(DoesCategoryExistGuard, DoesTextContentExistGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryService.create(createCategoryDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
