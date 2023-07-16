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
    return this.taxRepository.find({ where: { isDeleted: false } });
  }

  findOne(id: number) {
    return this.taxRepository.findOneBy({ id, isDeleted: false });
  }

  async update(id: number, updateTaxDto: UpdateTaxDto) {
    const tax = await this.findOne(id);

    Object.assign(tax, updateTaxDto);

    const newTax = this.taxRepository.create(tax);

    tax.isDeleted = true;

    return this.taxRepository.save(newTax);
  }

  async remove(id: number) {
    const tax = await this.findOne(id);
    tax.isDeleted = true;

    return this.taxRepository.save(tax);
  }
}
