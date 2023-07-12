import { REQUEST } from '@nestjs/core';
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
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { DoesTextContentExistGuard } from '../text-content/guards/text-content-exists.guard';
import { DoesLanguageCodeExistGuard } from '../language/guards/does-language-code-exist.guard';
import { catchingError } from 'src/core/error/helper/catching-error';
import { Request } from 'express';

@Controller('translation')
export class TranslationController {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly translationService: TranslationService,
  ) {}

  @Post()
  @UseGuards(DoesTextContentExistGuard, DoesLanguageCodeExistGuard)
  create(@Body() createTranslationDto: CreateTranslationDto) {
    try {
      return this.translationService.create(createTranslationDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTranslationDto: UpdateTranslationDto,
  ) {
    return this.translationService.update(+id, updateTranslationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationService.remove(+id);
  }
}
