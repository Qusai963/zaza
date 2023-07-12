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

  findAll() {
    return `This action returns all textContent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} textContent`;
  }

  update(id: number, updateTextContentDto: UpdateTextContentDto) {
    return `This action updates a #${id} textContent`;
  }

  remove(id: number) {
    return `This action removes a #${id} textContent`;
  }
}
