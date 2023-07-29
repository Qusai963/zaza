import { FileInterceptor } from '@nestjs/platform-express';
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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DoesParentCategorySafeForCategoriesGuard } from './guards/does-parent-category-safe-for-categories.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchingError } from 'src/core/error/helper/catching-error';
import { TranslationService } from '../translation/translation.service';
import { TextContentService } from '../text-content/text-content.service';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { ParamRequired } from 'src/core/decorators/param-required.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { CreateTextContentDto } from '../text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from '../translation/dto/create-translation.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { DoesCategoryExistGuard } from './guards/does-category-exist.guard';
import { UpdateTextContentDto } from '../text-content/dto/update-text-content.dto';
import { UpdateSecondTranslationDtoList } from '../translation/dto/update-translation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private request: Request,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
    private imageService: ImagesService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesParentCategorySafeForCategoriesGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
  )
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Body('textContent') createTextContentDto: CreateTextContentDto,
    @Body('translation') createTranslationDtoList: SecondCreateTranslationDto[],
  ) {
    try {
      const createdTextContent = await this.textContentService.create(
        createTextContentDto,
      );

      // TODO: apply validation on this array
      await this.translationService.createMany(
        createTranslationDtoList,
        createdTextContent,
      );

      return this.categoryService.create(
        createCategoryDto.parentCategoryId,
        createdTextContent,
      );
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllFathers(
    @ParamRequired('limit') limit: string,
    @ParamRequired('page') page: string,
    @Query('language') language: string,
  ) {
    try {
      return this.categoryService.findAllFathers(+limit, +page, language);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Get('acceptProducts')
  findAllThatAcceptProducts(@Query('language') language: string) {
    try {
      return this.categoryService.findAllThatAcceptProducts(language);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, DoesCategoryExistGuard)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ParamRequired('limit') limit: string,
    @ParamRequired('page') page: string,
    @Query('language') language: string,
  ) {
    try {
      return this.categoryService.findOneWithChildren(
        +id,
        +limit,
        +page,
        language,
      );
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesCategoryExistGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('textContent') updateTextContentDto: UpdateTextContentDto,
    @Body('translation')
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    try {
      const category = await this.categoryService.findOne(+id);
      const textContentId = category.textContentId;
      const updatedTextContent = await this.textContentService.update(
        +textContentId,
        updateTextContentDto,
      );
      const updatedTranslation = await this.translationService.update(
        textContentId,
        updateSecondTranslationDtoList,
      );

      return { category, updatedTextContent, updatedTranslation };
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesCategoryExistGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.categoryService.remove(+id);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async createImage(
    @Body('categoryId') categoryId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    path: Express.Multer.File,
  ) {
    const category = await this.categoryService.findOne(+categoryId);
    if (!category) throw new NotFoundException();
    category.image = this.imageService.create(path);

    await this.categoryRepository.save(category);

    return category;
  }
}
