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
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ImagesService } from '../images/images.service';
import { CreateTextContentDto } from '../text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from '../translation/dto/create-translation.dto';

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
    DoesCategoryExistGuard,
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
        createCategoryDto.categoryId,
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
    try {
      return this.categoryService.findAllFathers(+limit, +page, language);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get('findAllThatAcceptAddition')
  findAllThatAcceptAddition(@Query('language') language: string) {
    return this.categoryService.findAllThatAcceptAddition(language);
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
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async createPartner(
    @Body('categoryId') categoryId: number,
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
    const category = await this.categoryService.findOne(categoryId);
    if (!category) throw new NotFoundException();
    category.image = this.imageService.create(path);

    return this.categoryRepository.save(category);
  }
}
