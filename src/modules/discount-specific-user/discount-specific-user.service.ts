import { Injectable } from '@nestjs/common';
import { CreateDiscountSpecificUserDto } from './dto/create-discount-specific-user.dto';
import { UpdateDiscountSpecificUserDto } from './dto/update-discount-specific-user.dto';
import { DiscountSpecificUser } from './entities/discount-specific-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/core/query/pagination.query';
import { getOrderDiscountSpecificUserByCondition } from './helpers/sort.helper';

@Injectable()
export class DiscountSpecificUserService {
  constructor(
    @InjectRepository(DiscountSpecificUser)
    private readonly discountSpecificUserRepository: Repository<DiscountSpecificUser>,
  ) {}
  async create(
    createDiscountSpecificUserDtoList: CreateDiscountSpecificUserDto[],
    userId: number,
  ) {
    const discountsSpecificUserToCreate = await Promise.all(
      createDiscountSpecificUserDtoList.map(async (dto) => {
        const discountExists = await this.findOneByUserAndProductId(
          userId,
          dto.productId,
        );

        if (discountExists)
          await this.discountSpecificUserRepository.remove(discountExists);

        const discount = this.discountSpecificUserRepository.create({
          ...dto,
          userId,
        });
        return discount;
      }),
    );
    return this.discountSpecificUserRepository.save(
      discountsSpecificUserToCreate,
    );
  }

  async findAll(pagination: Pagination) {
    const [discountSpecificUser, count] =
      await this.discountSpecificUserRepository
        .createQueryBuilder('discountSpecificUser')
        .leftJoin('discountSpecificUser.user', 'user')
        .leftJoin('discountSpecificUser.product', 'product')
        .leftJoin('product.textContent', 'textContent')
        .select([
          'discountSpecificUser.id',
          'discountSpecificUser.percent',
          'discountSpecificUser.createdAt',
          'user.id',
          'user.name',
          'user.userName',
          'product.image',
          'product.id',
          'textContent.originalText',
        ])
        .where('product.isDeleted = 0')
        .take(pagination.limit)
        .skip((pagination.page - 1) * pagination.limit)
        .orderBy(getOrderDiscountSpecificUserByCondition(pagination.sort))
        .getManyAndCount();

    return { count, discountSpecificUser };
  }

  findOneByUserAndProductId(userId: number, productId: number) {
    return this.discountSpecificUserRepository.findOneBy({
      userId,
      productId,
    });
  }

  async findByUserId(userId: number) {
    const [discountSpecificUser, count] =
      await this.discountSpecificUserRepository
        .createQueryBuilder('discountSpecificUser')
        .andWhere('discountSpecificUser.userId = :userId', { userId })
        .leftJoin('discountSpecificUser.product', 'product')
        .leftJoin('product.textContent', 'textContent')
        .select([
          'discountSpecificUser.id',
          'discountSpecificUser.userId',
          'discountSpecificUser.percent',
          'discountSpecificUser.createdAt',
          'product.id',
          'product.image',
          'textContent.originalText',
        ])
        .where('product.isDeleted = 0')
        .getManyAndCount();

    return { count, discountSpecificUser };
  }

  findOneById(id: number) {
    return this.discountSpecificUserRepository.findOneBy({ id });
  }

  async update(
    discountId: number,
    updateDiscountSpecificUserDto: UpdateDiscountSpecificUserDto,
  ) {
    const discount = await this.findOneById(discountId);
    return this.discountSpecificUserRepository.save({
      ...discount,
      ...updateDiscountSpecificUserDto,
    });
  }

  async remove(id: number) {
    const discount = await this.findOneById(id);
    return this.discountSpecificUserRepository.remove(discount);
  }
}
