import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  create(createSuperAdminDto: CreateAdminDto) {
    return 'This action adds a new superAdmin';
  }

  findAll() {
    return `This action returns all superAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} superAdmin`;
  }

  update(id: number, updateSuperAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} superAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} superAdmin`;
  }
}
