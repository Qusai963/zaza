import { Injectable } from '@nestjs/common';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';

@Injectable()
export class ProductUnitService {
  create(createProductUnitDto: CreateProductUnitDto) {
    return 'This action adds a new productUnit';
  }

  findAll() {
    return `This action returns all productUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productUnit`;
  }

  update(id: number, updateProductUnitDto: UpdateProductUnitDto) {
    return `This action updates a #${id} productUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} productUnit`;
  }
}
