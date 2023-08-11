import { Injectable } from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateSecondTranslationDtoList } from './dto/update-translation.dto';
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
    textContentId: number,
  ) {
    const createdTranslations = [];

    for (const translationDto of createTranslationDto) {
      const translation = this.translationRepository.create({
        textContentId,
        ...translationDto,
      });
      const createdTranslation = await this.translationRepository.save(
        translation,
      );
      createdTranslations.push(createdTranslation);
    }
    return createdTranslations;
  }

  findByTextContentId(id: number) {
    return this.translationRepository.findBy({ textContentId: id });
  }

  async update(
    id: number,
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    const translation = await this.findByTextContentId(id);

    if (translation.length > 0)
      for (const updateTranslation of updateSecondTranslationDtoList) {
        const { code, translation: updatedTranslation } = updateTranslation;

        const existingTranslation = translation.find((t) => t.code === code);

        if (existingTranslation) {
          existingTranslation.translation = updatedTranslation;
        } else {
          const newTranslation = this.translationRepository.create({
            code,
            textContentId: id,
            translation: updatedTranslation,
          });
          translation.push(newTranslation);
        }
      }

    return this.translationRepository.save(translation);
  }
}
