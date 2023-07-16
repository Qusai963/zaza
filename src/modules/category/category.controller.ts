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
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DoesCategoryExistGuard } from './guards/does-category-exists.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchingError } from 'src/core/error/helper/catching-error';
import { TranslationService } from '../translation/translation.service';
import { TextContentService } from '../text-content/text-content.service';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { ParamRequired } from 'src/core/decorators/param-required.decorator';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private request: Request,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
  ) {}

  @UseGuards(
    DoesCategoryExistGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
  )
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const { textContent, translation, ...category } = createCategoryDto;

      const createdTextContent = await this.textContentService.create(
        textContent,
      );

      await this.translationService.createMany(translation, createdTextContent);

      return this.categoryService.create(
        category.categoryId,
        createdTextContent,
      );
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get()
  findAllFathers(
    @ParamRequired('limit') limit: string,
    @ParamRequired('page') page: string,
    @Query('language') language: string,
  ) {
    return this.categoryService.findAllFathers(+limit, +page, language);
  }

  @Get('findAllWithProducts')
  findAllWithProducts(@Query('language') language: string) {
    return this.categoryService.findAllWithProducts(language);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ParamRequired('limit') limit: string,
    @ParamRequired('page') page: string,
    @Query('language') language: string,
  ) {
    return this.categoryService.findAllChildren(+id, +limit, +page, language);
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
