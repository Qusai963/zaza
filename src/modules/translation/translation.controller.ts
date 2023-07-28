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
import {
  UpdateSecondTranslationDtoList,
  UpdateTranslationDto,
} from './dto/update-translation.dto';
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

  @Get(':textContentId')
  findOne(@Param('textContentId') textContentId: string) {
    return this.translationService.findByTextContentId(+textContentId);
  }

  @Patch(':textContentId')
  update(
    @Param('textContentId') textContentId: string,
    @Body('translation')
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    return this.translationService.update(
      +textContentId,
      updateSecondTranslationDtoList,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationService.remove(+id);
  }
}
