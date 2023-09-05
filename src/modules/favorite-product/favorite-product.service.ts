import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { Brackets, Repository } from 'typeorm';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { Request } from 'express';
import { Product } from '../product/entities/product.entity';
import { getWhereByCondition } from 'src/core/helpers/search.helper';
import { getOrderProductByCondition } from 'src/core/helpers/sort.helper';

@Injectable()
export class FavoriteProductService {
  constructor(
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(userId: number, productId: number) {
    const favorite = await this.findOneByUserAndProduct(userId, productId);

    if (favorite) return this.favoriteProductRepository.remove(favorite);

    if (!favorite) {
      const newFavorite = this.favoriteProductRepository.create({
        userId,
        productId,
      });

      return this.favoriteProductRepository.save(newFavorite);
    }
  }

  async findAllByUserId(userId: number, query: QueryFilter, req: Request) {
    const productIds = await this.favoriteProductRepository.find({
      where: { userId },
      select: {
        productId: true,
      },
    });
    const Ids: number[] = [];

    productIds.forEach((id) => {
      Ids.push(id.productId);
    });

    let qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect(
        'product.discountSpecificUsers',
        'discountSpecificUsers',
      )
      .leftJoinAndSelect('product.textContent', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect(
        'product.productUnits',
        'productUnits',
        'productUnits.isDeleted = 0',
      )
      .leftJoinAndSelect('productUnits.textContent', 'productUnitTextContent')
      .leftJoinAndSelect('productUnits.unit', 'unit', 'unit.isDeleted = 0')
      .leftJoinAndSelect('unit.textContent', 'unitTextContent')
      .leftJoinAndSelect('unitTextContent.translations', 'unitTranslations')
      .leftJoinAndSelect(
        'productUnitTextContent.translations',
        'productUnitTranslations',
      )
      .leftJoinAndSelect('product.discounts', 'discounts')
      .where([
        {
          ...getWhereByCondition(query.search, -1),
          isDeleted: 0,
        },
      ])
      .andWhere('product.id IN (:...Ids)', {
        Ids,
      })
      .orderBy(getOrderProductByCondition(query.sort))
      .take(query.limit)
      .skip((query.page - 1) * query.limit);

    if (query.search) {
      qb = qb.andWhere(
        new Brackets((qb) => {
          if (query.search.split(':')[0] == 'name') {
            if (query.language == 'de') {
              qb.where('textContent.originalText LIKE :search', {
                search: `%${query.search.split(':')[1]}%`,
              });
            } else {
              qb.orWhere('translations.translation LIKE :search', {
                search: `%${query.search.split(':')[1]}%`,
              }).andWhere('translations.code = :languageCode', {
                languageCode: query.language,
              });
            }
          } else if (query.search.split(':')[0] == 'barCode') {
            qb.where('product.barCode LIKE :search', {
              search: `%${query.search.split(':')[1]}%`,
            });
          }
        }),
      );
    }

    const [products, count] = await qb.getManyAndCount();

    const translatedProducts = await Promise.all(
      products.map(async (product) => {
        const translation = product.textContent.translations.find(
          (translation) => translation.code === query.language,
        );

        const translatedText = translation
          ? translation.translation
          : product.textContent.originalText;

        const translatedProductUnits = await Promise.all(
          product.productUnits.map(async (unit) => {
            const unitTranslation = unit.textContent.translations.find(
              (translation) => translation.code === query.language,
            );

            const translatedUnitText = unitTranslation
              ? unitTranslation.translation
              : unit.textContent.originalText;

            const translatedUnitContent =
              unit.unit.textContent.translations.find(
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
              translatedText:
                translatedUnitText || unit.textContent.originalText,
              translatedUnitText:
                translatedUnitContentText || unit.unit.textContent.originalText,
            };
          }),
        );

        const discount = product.discounts[0];
        const discountSpecificUsers = product.discountSpecificUsers[0];

        const favoriteProduct = await this.findOneByUserAndProduct(
          userId,
          product.id,
        );

        let discountPercent: number = 0;
        let discountId: any = null;

        if (discount) {
          discountPercent = discount.percent;
          discountId = discount.id;
        } else if (discountSpecificUsers) {
          discountPercent = discountSpecificUsers.percent;
          discountId = discountSpecificUsers.id;
        }

        return {
          id: product.id,
          image: product.image,
          barCode: +product.barCode,
          parentCategoryId: product.parentCategoryId,
          isFavorite: favoriteProduct ? true : false,
          discount: discountPercent,
          discountId: discountId,
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

  findOneByUser(userId: number) {
    return this.favoriteProductRepository.findOneBy({
      userId,
    });
  }
  findOneByUserAndProduct(userId: number, productId: number) {
    return this.favoriteProductRepository.findOneBy({
      userId,
      productId,
    });
  }
}
