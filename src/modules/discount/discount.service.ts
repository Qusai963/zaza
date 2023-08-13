import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { Repository } from 'typeorm';
import { Pagination } from 'src/core/query/pagination.query';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}
  async create(createDiscountDtoList: CreateDiscountDto[]) {
    const discountsToCreate = await Promise.all(
      createDiscountDtoList.map(async (dto) => {
        const discountExists = await this.discountRepository.findOne({
          where: {
            productId: dto.productId,
            isDeleted: false,
          },
        });

        if (discountExists) {
          discountExists.isDeleted = true;
          await this.discountRepository.save(discountExists);
        }

        const discount = this.discountRepository.create(dto);
        return discount;
      }),
    );

    return this.discountRepository.save(discountsToCreate);
  }

  async findAll(query: Pagination) {
    const [discount, count] = await this.discountRepository.findAndCount({
      where: { isDeleted: false },
      relations: {
        product: true,
      },
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
  }
}
