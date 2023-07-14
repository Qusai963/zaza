import { Injectable } from '@nestjs/common';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { Repository } from 'typeorm';
import { TextContent } from '../text-content/entities/text-content.entity';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(Tax)
    private readonly taxRepository: Repository<Tax>,
  ) {}
  create(createTaxDto: CreateTaxDto, textContent: TextContent) {
    const tax = this.taxRepository.create(createTaxDto);
    tax.textContent = textContent;
    return this.taxRepository.save(tax);
  }

  findAll() {
    return `This action returns all tax`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tax`;
  }

  update(id: number, updateTaxDto: UpdateTaxDto) {
    return `This action updates a #${id} tax`;
  }

  remove(id: number) {
    return `This action removes a #${id} tax`;
  }
}
