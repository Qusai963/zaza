import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Post()
  create(@Body() createTranslationDto: CreateTranslationDto) {
    return this.translationService.create(createTranslationDto);
  }

  @Get()
  findAll() {
    return this.translationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.translationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTranslationDto: UpdateTranslationDto) {
    return this.translationService.update(+id, updateTranslationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.translationService.remove(+id);
  }
}
