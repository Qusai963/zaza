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
import { DoesTextContentExistGuard } from '../text-content/guards/text-content-exists.guard';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { TaxDto } from './dto/tax.dto';

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
  async create(@Body() taxDto: TaxDto) {
    try {
      const { textContent, translation, tax } = taxDto;

      const createdTextContent = await this.textContentService.create(
        textContent,
      );

      await this.translationService.createMany(translation, createdTextContent);

      return this.taxService.create(tax, createdTextContent);
    } catch (error) {
      catchingError(error, this.request);
    }
  }
  @Get()
  findAll() {
    return this.taxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaxDto: UpdateTaxDto) {
    return this.taxService.update(+id, updateTaxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxService.remove(+id);
  }
}
