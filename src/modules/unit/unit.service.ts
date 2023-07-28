import { Injectable } from '@nestjs/common';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { Repository } from 'typeorm';
import { TextContent } from '../text-content/entities/text-content.entity';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit) private readonly unitRepository: Repository<Unit>,
  ) {}
  async create(textContent: TextContent) {
    const unit = this.unitRepository.create({
      textContent,
    });

    const savedUnit = await this.unitRepository.save(unit);

    return this.unitRepository.findOne({
      where: { id: savedUnit.id },
      relations: ['textContent', 'textContent.translations'],
    });
  }

  async findAll(code: string) {
    const units = await this.unitRepository.find({
      where: { isDeleted: false },
      relations: ['textContent', 'textContent.translations'],
    });
    const translatedUnits = units.map((unit) => {
      const translation = unit.textContent.translations.find(
        (translation) => translation.code === code,
      );

      const translatedText = translation
        ? translation.translation
        : unit.textContent.originalText;

      return {
        id: unit.id,
        textContentId: unit.textContentId,
        translatedText: translatedText || unit.textContent.originalText, // Use originalText if translatedText is empty
      };
    });

    return {
      units: translatedUnits,
    };
  }

  findOne(id: number) {
    if (id)
      return this.unitRepository.findOne({
        where: { id, isDeleted: false },
        relations: ['textContent', 'textContent.translations'],
      });
    return null;
  }

  async findByCode(id: number, code: string) {
    const unit = await this.findOne(id);

    const translation = unit.textContent.translations.find(
      (translation) => translation.code === code,
    );

    const translatedText = translation
      ? translation.translation
      : unit.textContent.originalText;

    return {
      id: unit.id,
      textContentId: unit.textContentId,
      translatedText: translatedText || unit.textContent.originalText,
    };
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  async remove(id: number) {
    const unit = await this.findOne(id);
    unit.isDeleted = true;
    return this.unitRepository.save(unit);
  }
}
