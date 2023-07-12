import { Injectable } from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { Repository } from 'typeorm';
import { TextContent } from '../text-content/entities/text-content.entity';

@Injectable()
export class TranslationService {
  constructor(
    @InjectRepository(Translation)
    private readonly translationRepository: Repository<Translation>,
  ) {}
  create(createTranslationDto: CreateTranslationDto) {
    const translation = this.translationRepository.create(createTranslationDto);
    return this.translationRepository.save(translation);
  }

  async createMany(
    createTranslationDto: CreateTranslationDto[],
    textContent: TextContent,
  ) {
    const createdTranslations = [];

    for (const translationDto of createTranslationDto) {
      const translation = this.translationRepository.create({
        textContent,
        ...translationDto,
      });
      const createdTranslation = await this.translationRepository.save(
        translation,
      );
      createdTranslations.push(createdTranslation);
    }
    return createdTranslations;
  }

  findOne(id: number) {
    return `This action returns a #${id} translation`;
  }

  update(id: number, updateTranslationDto: UpdateTranslationDto) {
    return `This action updates a #${id} translation`;
  }

  remove(id: number) {
    return `This action removes a #${id} translation`;
  }
}
