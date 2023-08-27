import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Pagination } from 'src/core/query/pagination.query';
import { getOrderByCondition } from 'src/core/helpers/sort.helper';
import { LanguageQuery } from 'src/core/query/language.query';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  create(userId: number) {
    const order = this.orderRepository.create({
      userId,
    });
    return this.orderRepository.save(order);
  }

  async findMyOrders(userId: number, query: Pagination) {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: { userId },
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      order: getOrderByCondition(query.sort),
    });
    return {
      count,
      orders,
    };
  }

  async findAll(query: Pagination) {
    const [orders, count] = await this.orderRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      relations: {
        user: true,
      },
      order: getOrderByCondition(query.sort),
    });
    return {
      count,
      orders,
    };
  }

  async findAllByUserId(userId: number, query: Pagination) {
    const [orders, count] = await this.orderRepository.findAndCount({
      where: { userId },
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      relations: {
        user: true,
      },
      order: getOrderByCondition(query.sort),
    });
    return {
      count,
      orders,
    };
  }

  findOne(id: number, language: LanguageQuery) {
    if (language.language === 'de')
      return (
        this.orderRepository
          .createQueryBuilder('order')
          .where('order.id = :id', { id })
          .leftJoin('order.productOrders', 'productOrders')
          .leftJoin('productOrders.productUnit', 'productUnit')
          .leftJoin('productUnit.textContent', 'productUnitTextContent')
          // .leftJoin(
          //   'productUnitTextContent.translations',
          //   'productUnitTranslations',
          // )
          .leftJoin('productUnit.product', 'product')
          .leftJoin('product.textContent', 'productTextContent')
          .leftJoin('product.discounts', 'discounts')
          // .leftJoin(
          //   'productTextContent.translations',
          //   'productTranslations',
          // )
          .leftJoin('productUnit.unit', 'unit')
          .leftJoin('unit.textContent', 'unitTextContent')
          // .leftJoin('unitTextContent.translations', 'unitTranslations')
          .select([
            'order',
            'productOrders.id',
            'productOrders.amount',
            'productUnit.id',
            'productUnit.quantity',
            'productUnit.isDeleted',
            'productUnit.price',
            'productUnitTextContent.originalText',
            'product.id',
            'product.parentCategoryId',
            'product.image',
            'product.createdAt',
            'product.isDeleted',
            'productTextContent.originalText',
            'discounts.id',
            'discounts.percent',
            'discounts.isDeleted',
            'unit.isDeleted',
            'unitTextContent.originalText',
          ])

          .getOne()
      );
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
