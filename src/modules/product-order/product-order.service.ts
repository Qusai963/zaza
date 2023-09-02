import { Injectable } from '@nestjs/common';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductOrder } from './entities/product-order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductOrderService {
  constructor(
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
  ) {}
  create(createProductOrderDtoList: CreateProductOrderDto[], orderId: number) {
    const productOrderList = [];
    for (const productOrderDto of createProductOrderDtoList) {
      const createdProductOrder = this.productOrderRepository.create({
        ...productOrderDto,
        orderId,
      });
      productOrderList.push(createdProductOrder);
    }

    return this.productOrderRepository.save(productOrderList);
  }

  // findAll() {
  //   return `This action returns all productOrder`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} productOrder`;
  // }

  // update(id: number, updateProductOrderDto: UpdateProductOrderDto) {
  //   return `This action updates a #${id} productOrder`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} productOrder`;
  // }
}
