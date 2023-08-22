import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { Pagination } from 'src/core/query/pagination.query';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { Product } from '../product/entities/product.entity';
import { getWhereByCondition } from 'src/core/helpers/search.helper';
import { getOrderByCondition } from 'src/core/helpers/sort.helper';
import { tr } from '@faker-js/faker';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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

  async findAll(query: QueryFilter) {
    const prodIds = await this.discountRepository.find({
      where: {
        percent: MoreThan(0),
      },
      select: {
        productId: true,
      },
    });

    const Ids: number[] = [];

    prodIds.forEach((id) => {
      Ids.push(id.productId);
    });

    const [products, count] = await this.productRepository.findAndCount({
      relations: [
        'textContent',
        'textContent.translations',
        'productUnits',
        'productUnits.textContent',
        'productUnits.unit',
        'productUnits.unit.textContent',
        'productUnits.unit.textContent.translations',
        'productUnits.textContent.translations',
        'discounts',
      ],
      where: {
        isDeleted: 0,
        id: In(Ids),
      },

      order: getOrderByCondition(query.sort),
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });

    const translatedProducts = products.map((product) => {
      const translation = product.textContent.translations.find(
        (translation) => translation.code === query.language,
      );

      const translatedText = translation
        ? translation.translation
        : product.textContent.originalText;

      const translatedProductUnits = product.productUnits.map((unit) => {
        const unitTranslation = unit.textContent.translations.find(
          (translation) => translation.code === query.language,
        );

        const translatedUnitText = unitTranslation
          ? unitTranslation.translation
          : unit.textContent.originalText;

        // Include unit's text content translation
        const translatedUnitContent = unit.unit.textContent.translations.find(
          (translation) => translation.code === query.language,
        );

        const translatedUnitContentText = translatedUnitContent
          ? translatedUnitContent.translation
          : unit.unit.textContent.originalText;

        return {
          id: unit.id,
          unitId: unit.unitId,
          quantity: unit.quantity,
          price: unit.price,
          translatedText: translatedUnitText || unit.textContent.originalText,
          translatedUnitText:
            translatedUnitContentText || unit.unit.textContent.originalText,
        };
      });

      const discounts = product.discounts.find(
        (discount) => discount.isDeleted === false,
      );

      return {
        id: product.id,
        image: product.image,
        parentCategoryId: product.parentCategoryId,
        discount: discounts ? discounts.percent : 0,
        translatedText: translatedText || product.textContent.originalText,
        translatedProductUnits,
      };
    });

    return {
      count,
      translatedProducts,
    };
  }
  findOne(id: number) {
    return this.discountRepository.findOneBy({
      id,
      isDeleted: false,
    });
  }

  async update(discountId: number, updateDiscountDto: UpdateDiscountDto) {
    const { id, ...discount } = await this.findOne(discountId);

    const createNewDiscount = this.discountRepository.create({
      ...discount,
      percent: updateDiscountDto.percent,
    });

    discount.isDeleted = true;

    await this.discountRepository.save({ id, ...discount });

    return this.discountRepository.save(createNewDiscount);
  }

  async remove(id: number) {
    const discount = await this.findOne(id);

    discount.isDeleted = true;

    return this.discountRepository.save(discount);
  }
}
