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
  @Get()
  findAll() {
    try {
      return this.taxService.findAll();
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.taxService.findOne(+id);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(DoesTaxExistInParamGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
    try {
      return this.taxService.update(+id, updateTaxDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(DoesTaxExistInParamGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.taxService.remove(+id);
    } catch (error) {
      catchingError(error, this.request);
    }
  }
}
