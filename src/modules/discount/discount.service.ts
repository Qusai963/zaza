import { Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './entities/discount.entity';
import { In, Repository } from 'typeorm';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { Product } from '../product/entities/product.entity';
import { getOrderByCondition } from 'src/core/helpers/sort.helper';
import { FavoriteProductService } from '../favorite-product/favorite-product.service';
import { Request } from 'express';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(DiscountSpecificUser)
    private readonly discountSpecificUserRepository: Repository<DiscountSpecificUser>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly favoriteProductService: FavoriteProductService,
  ) {}
  async create(createDiscountDtoList: CreateDiscountDto[]) {
    const discountsToCreate = await Promise.all(
      createDiscountDtoList.map(async (dto) => {
        const discountExists = await this.findOneByProductId(dto.productId);

        if (discountExists)
          await this.discountRepository.remove(discountExists);

        const discount = this.discountRepository.create(dto);
        return discount;
      }),
    );

    return this.discountRepository.save(discountsToCreate);
  }

  async findAll(query: QueryFilter, req: Request) {
    const userId = getUserId(req);
    const discountProductIds = await this.discountRepository.find({
      select: {
        productId: true,
      },
    });

    const discountSpecificProductIds =
      await this.discountSpecificUserRepository.find({
        where: { userId },
        select: {
          productId: true,
        },
      });

    const Ids: number[] = [];

    discountProductIds.forEach((id) => {
      if (!Ids.includes(id.productId)) {
        Ids.push(id.productId);
      }
    });

    discountSpecificProductIds.forEach((id) => {
      if (!Ids.includes(id.productId)) {
        Ids.push(id.productId);
      }
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

    const translatedProducts = await Promise.all(
      products.map(async (product) => {
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

        const discount = product.discounts[0];

        const favoriteProduct =
          await this.favoriteProductService.findOneByUserAndProduct(
            userId,
            product.id,
          );

        return {
          id: product.id,
          image: product.image,
          parentCategoryId: product.parentCategoryId,
          isFavorite: favoriteProduct ? true : false,
          discount: discount ? discount.percent : 0,
          discountId: discount ? discount.id : null,
          translatedText: translatedText || product.textContent.originalText,
          translatedProductUnits,
        };
      }),
    );

    return {
      count,
      translatedProducts,
    };
  }

  findOneByProductId(productId: number) {
    return this.discountRepository.findOneBy({
      productId,
    });
  }

  findOneById(id: number) {
    return this.discountRepository.findOneBy({
      id,
    });
  }

  async update(discountId: number, updateDiscountDto: UpdateDiscountDto) {
    const discount = await this.findOneById(discountId);
    return this.discountRepository.save({ ...discount, ...updateDiscountDto });
  }

  async remove(id: number) {
    const discount = await this.findOneById(id);
    return this.discountRepository.remove(discount);
  }
}
