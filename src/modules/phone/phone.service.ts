import { Injectable } from '@nestjs/common';
import { CreateMultiPhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PhoneService {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  async create(createMultiPhoneDto: CreateMultiPhoneDto, userId: number) {
    const phones = createMultiPhoneDto.phoneNumbers;
    for (let phone of phones) {
      const createdPhone = this.phoneRepository.create({
        ...phone,
        userId,
      });
      await this.phoneRepository.save(createdPhone);
    }
    return { phones };
  }

  findAll() {
    return `This action returns all phone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} phone`;
  }

  update(id: number, updatePhoneDto: UpdatePhoneDto) {
    return `This action updates a #${id} phone`;
  }

  remove(id: number) {
    return `This action removes a #${id} phone`;
  }
}
