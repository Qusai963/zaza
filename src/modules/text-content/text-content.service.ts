import { Injectable } from '@nestjs/common';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { UpdateTextContentDto } from './dto/update-text-content.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TextContent } from './entities/text-content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TextContentService {
  constructor(
    @InjectRepository(TextContent)
    private readonly textContentRepository: Repository<TextContent>,
  ) {}
  async create(createTextContentDto: CreateTextContentDto) {
    const textContent = this.textContentRepository.create(createTextContentDto);

    return this.textContentRepository.save(textContent);
  }

  findOne(id: number) {
    return this.textContentRepository.findOneBy({ id });
  }

  async update(id: number, updateTextContentDto: UpdateTextContentDto) {
    const textContent = await this.findOne(id);
    return this.textContentRepository.save({
      ...textContent,
      ...updateTextContentDto,
    });
  }
}
