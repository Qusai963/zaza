import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { UserService } from '../user/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';
import { In, Repository } from 'typeorm';
import { PHONE_EXISTS } from 'src/core/error/messages/phone-exists.message';

@Injectable()
export class PhoneService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  async create(createPhoneDto: CreatePhoneDto, userId: number) {
    const phones = createPhoneDto.phoneNumbers;
    phones.map((number) => {
      const phone = this.phoneRepository.create({ number, userId });
      this.phoneRepository.save(phone);
    });
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
