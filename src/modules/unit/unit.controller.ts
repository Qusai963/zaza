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
import { UnitService } from './unit.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { catchingError } from 'src/core/error/helper/catching-error';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateTextContentDto } from '../text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from '../translation/dto/create-translation.dto';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { UpdateTextContentDto } from '../text-content/dto/update-text-content.dto';
import { UpdateSecondTranslationDtoList } from '../translation/dto/update-translation.dto';
import { DoesUnitExistGuard } from './guards/does-unit-exist.guard';

@Controller('unit')
export class UnitController {
  constructor(
    private readonly unitService: UnitService,
    @Inject(REQUEST) private readonly request: Request,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
  ) {}

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
  )
  @Post()
  async create(
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

      return this.unitService.create(createdTextContent);
    } catch (error) {
      catchingError(this.request, error);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Get()
  findAll(@Query('language') code: string) {
    try {
      return this.unitService.findAll(code);
    } catch (error) {
      catchingError(this.request, error);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('language') code: string) {
    try {
      return this.unitService.findByCode(+id, code);
    } catch (error) {
      catchingError(this.request, error);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesUnitExistGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('textContent') updateTextContentDto: UpdateTextContentDto,
    @Body('translation')
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    try {
      const unit = await this.unitService.findOne(+id);
      const textContentId = unit.textContentId;
      const updatedTextContent = await this.textContentService.update(
        +textContentId,
        updateTextContentDto,
      );

      const updatedTranslation = await this.translationService.update(
        textContentId,
        updateSecondTranslationDtoList,
      );
      return unit;
    } catch (error) {
      catchingError(this.request, error);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesUnitExistGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.unitService.remove(+id);
    } catch (error) {
      catchingError(this.request, error);
    }
  }
}
