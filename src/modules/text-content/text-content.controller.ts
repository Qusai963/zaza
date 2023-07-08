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
import { TextContentService } from './text-content.service';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { UpdateTextContentDto } from './dto/update-text-content.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchingError } from 'src/core/error/helper/catching-error';
import { DoesLanguageCodeExistGuard } from '../language/guards/does-language-code-exist.guard';

@Controller('text-content')
export class TextContentController {
  constructor(
    private readonly textContentService: TextContentService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @Post()
  @UseGuards(DoesLanguageCodeExistGuard)
  create(@Body() createTextContentDto: CreateTextContentDto) {
    try {
      return this.textContentService.create(createTextContentDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get()
  findAll() {
    return this.textContentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.textContentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTextContentDto: UpdateTextContentDto,
  ) {
    return this.textContentService.update(+id, updateTextContentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.textContentService.remove(+id);
  }
}
