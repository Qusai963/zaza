import { Injectable } from '@nestjs/common';
import { CreateTextContentDto } from './dto/create-text-content.dto';
import { UpdateTextContentDto } from './dto/update-text-content.dto';

@Injectable()
export class TextContentService {
  create(createTextContentDto: CreateTextContentDto) {
    return 'This action adds a new textContent';
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
