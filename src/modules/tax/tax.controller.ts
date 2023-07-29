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
  Query,
} from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { catchingError } from 'src/core/error/helper/catching-error';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { DoesTaxExistInParamGuard } from './guards/does-tax-exists-in-param.guard';
import { CreateTextContentDto } from '../text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from '../translation/dto/create-translation.dto';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateTextContentDto } from '../text-content/dto/update-text-content.dto';
import { UpdateSecondTranslationDtoList } from '../translation/dto/update-translation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tax')
@Controller('tax')
export class TaxController {
  constructor(
    private readonly taxService: TaxService,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @Post()
  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
  )
  async create(
    @Body('tax') createTaxDto: CreateTaxDto,
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
      return this.taxService.create(createTaxDto, createdTextContent);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Get()
  findAll(@Query('code') code: string) {
    try {
      return this.taxService.findAll(code);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesTaxExistInParamGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query('code') code: string) {
    try {
      return this.taxService.getOne(+id, code);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesTaxExistInParamGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaxDto: UpdateTaxDto,
    @Body('textContent') updateTextContentDto: UpdateTextContentDto,
    @Body('translation')
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    try {
      const tax = await this.taxService.findOne(+id);
      const textContentId = tax.textContentId;
      const updatedTextContent = await this.textContentService.update(
        +textContentId,
        updateTextContentDto,
      );

      const updatedTranslation = await this.translationService.update(
        textContentId,
        updateSecondTranslationDtoList,
      );
      return this.taxService.update(+id, updateTaxDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(DoesTaxExistInParamGuard, AuthGuard, IsAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.taxService.remove(+id);
    } catch (error) {
      catchingError(error, this.request);
    }
  }
}
