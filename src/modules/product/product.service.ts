import { FavoriteProductService } from './../favorite-product/favorite-product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { Brackets, Repository, ServerApiVersion } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { TextContent } from '../text-content/entities/text-content.entity';
import { QueryFilter } from 'src/core/query/query-filter.query';
import {
  getOrderByCondition,
  getOrderProductByCondition,
} from 'src/core/helpers/sort.helper';
import { getWhereByCondition } from 'src/core/helpers/search.helper';
import { LanguageQuery } from 'src/core/query/language.query';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { UpdateProductQuantityDto } from './dto/update-product-quantity.dto';
import { TaxIdDto } from './dto/taxId-dto';
import { CategoryTypeEnum } from '../category/constants/category-enum';
import { Category } from '../category/entities/category.entity';
import { Discount } from '../discount/entities/discount.entity';
import { Request } from 'express';
import { getUserId } from '../user/helper/get-user-id.helper';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';
import { PaginationWithLanguage } from 'src/core/query/pagination-with-language.query';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(ProductUnit)
    private readonly productUnitRepository: Repository<ProductUnit>,
    private readonly favoriteProductService: FavoriteProductService,
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
    @InjectRepository(DiscountSpecificUser)
    private readonly discountSpecificUserRepository: Repository<DiscountSpecificUser>,
  ) {}
  async create(createProductDto: CreateProductDto, textContent: TextContent) {
    const product = this.productRepository.create(createProductDto);

    product.textContent = textContent;
    const newProduct = await this.productRepository.save(product);

    return this.productRepository.findOneBy({ id: newProduct.id });
  }

  async findAll(
    query: QueryFilter,
    req: Request,
    parentCategoryId: number = -1,
  ) {
    const userId = getUserId(req);
    if (query.search)
      if (query.search.split(':')[1] === '')
        return { translatedProducts: [], count: 0 };

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
          ...getWhereByCondition(query.search, parentCategoryId),
          isDeleted: 0,
        },
      ])
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

        const favoriteProduct =
          await this.favoriteProductService.findOneByUserAndProduct(
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
          barCode: product.barCode,
          parentCategoryId: product.parentCategoryId,
          isFavorite: favoriteProduct ? true : false,
          discount: discountPercent,
          discountId: discountId,
          type: discount ? 'normalDiscount' : 'discountSpecificUsers',
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

  async findAllByProductUnitIds(
    query: PaginationWithLanguage,
    req: Request,
    productUnitIds: number[],
  ) {
    const userId = getUserId(req);
    let qb = this.productUnitRepository
      .createQueryBuilder('productUnits')
      .leftJoinAndSelect(
        'productUnits.product',
        'product',
        'product.isDeleted = 0',
      )
      .leftJoinAndSelect(
        'product.discountSpecificUsers',
        'discountSpecificUsers',
      )
      .leftJoinAndSelect('product.textContent', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('productUnits.textContent', 'productUnitTextContent')
      .leftJoinAndSelect('productUnits.unit', 'unit', 'unit.isDeleted = 0')
      .leftJoinAndSelect('unit.textContent', 'unitTextContent')
      .leftJoinAndSelect('unitTextContent.translations', 'unitTranslations')
      .leftJoinAndSelect(
        'productUnitTextContent.translations',
        'productUnitTranslations',
      )
      .leftJoinAndSelect('product.discounts', 'discounts')
      .where(
        'productUnits.isDeleted = 0 AND productUnits.id IN (:...productUnitsIds)',
        {
          productUnitsIds: productUnitIds,
        },
      )
      .take(query.limit)
      .skip((query.page - 1) * query.limit);

    let [productUnits, count] = await qb.getManyAndCount();

    // Sort the products based on the provided productUnitIds
    productUnits = productUnits.sort((a, b) => {
      const aIndex = productUnitIds.indexOf(
        a.id, // Assuming you want to sort by the first productUnit
      );
      const bIndex = productUnitIds.indexOf(
        b.id, // Assuming you want to sort by the first productUnit
      );

      return aIndex - bIndex;
    });

    const translatedProducts = await Promise.all(
      productUnits.map(async (productUnit) => {
        const translation = productUnit.textContent.translations.find(
          (translation) => translation.code === query.language,
        );

        const translatedText = translation
          ? translation.translation
          : productUnit.textContent.originalText;

        const translatedUnitContent =
          productUnit.unit.textContent.translations.find(
            (translation) => translation.code === query.language,
          );

        const translatedUnitContentText = translatedUnitContent
          ? translatedUnitContent.translation
          : productUnit.unit.textContent.originalText;

        const translatedProduct =
          productUnit.product.textContent.translations.find(
            (translation) => translation.code === query.language,
          );

        const translatedProductContentText = translatedProduct
          ? translatedProduct.translation
          : productUnit.product.textContent.originalText;

        const discount = productUnit.product.discounts[0];
        const discountSpecificUsers =
          productUnit.product.discountSpecificUsers[0];

        const favoriteProduct =
          await this.favoriteProductService.findOneByUserAndProduct(
            userId,
            productUnit.product.id,
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
          id: productUnit.product.id,
          barCode: productUnit.product.barCode,
          image: productUnit.product.image,
          parentCategoryId: productUnit.product.parentCategoryId,
          isFavorite: favoriteProduct ? true : false,
          discount: discountPercent,
          discountId: discountId,
          type: discount ? 'normalDiscount' : 'discountSpecificUsers',
          translatedText:
            translatedProductContentText ||
            productUnit.product.textContent.originalText,
          translatedProductUnits: [
            {
              id: productUnit.id,
              unitId: productUnit.unitId,
              quantity: productUnit.quantity,
              price: productUnit.price,
              translatedText:
                translatedText || productUnit.textContent.originalText,
              translatedUnitText:
                translatedUnitContentText ||
                productUnit.unit.textContent.originalText,
            },
          ],
        };
      }),
    );

    return { translatedProducts, count };
  }

  // async findAllByProductUnitIds(
  //   query: QueryFilter,
  //   req: Request,
  //   productUnitIds: number[],
  // ) {
  //   const userId = getUserId(req);
  //   let qb = this.productRepository
  //     .createQueryBuilder('product')
  //     .leftJoinAndSelect(
  //       'product.discountSpecificUsers',
  //       'discountSpecificUsers',
  //     )
  //     .leftJoinAndSelect('product.textContent', 'textContent')
  //     .leftJoinAndSelect('textContent.translations', 'translations')
  //     .leftJoinAndSelect(
  //       'product.productUnits',
  //       'productUnits',
  //       'productUnits.isDeleted = 0',
  //     )
  //     .leftJoinAndSelect('productUnits.textContent', 'productUnitTextContent')
  //     .leftJoinAndSelect('productUnits.unit', 'unit', 'unit.isDeleted = 0')
  //     .leftJoinAndSelect('unit.textContent', 'unitTextContent')
  //     .leftJoinAndSelect('unitTextContent.translations', 'unitTranslations')
  //     .leftJoinAndSelect(
  //       'productUnitTextContent.translations',
  //       'productUnitTranslations',
  //     )
  //     .leftJoinAndSelect('product.discounts', 'discounts')
  //     .where([
  //       {
  //         ...getWhereByCondition(query.search, -1),
  //         isDeleted: 0,
  //       },
  //     ])
  //     .andWhere('productUnits.id IN (:...productUnitsIds)', {
  //       productUnitsIds: productUnitIds,
  //     })
  //     .orderBy(getOrderProductByCondition(query.sort))
  //     .take(query.limit)
  //     .skip((query.page - 1) * query.limit);

  //   if (query.search) {
  //     qb = qb.andWhere(
  //       new Brackets((qb) => {
  //         if (query.search.split(':')[0] == 'name') {
  //           if (query.language == 'de') {
  //             qb.where('textContent.originalText LIKE :search', {
  //               search: `%${query.search.split(':')[1]}%`,
  //             });
  //           } else {
  //             qb.orWhere('translations.translation LIKE :search', {
  //               search: `%${query.search.split(':')[1]}%`,
  //             }).andWhere('translations.code = :languageCode', {
  //               languageCode: query.language,
  //             });
  //           }
  //         } else if (query.search.split(':')[0] == 'barCode') {
  //           qb.where('product.barCode LIKE :search', {
  //             search: `%${query.search.split(':')[1]}%`,
  //           });
  //         }
  //       }),
  //     );
  //   }

  //   let [products, count] = await qb.getManyAndCount();

  //   // Sort the products based on the provided productUnitIds
  //   products = products.sort((a, b) => {
  //     const aIndex = productUnitIds.indexOf(
  //       a.productUnits[0].id, // Assuming you want to sort by the first productUnit
  //     );
  //     const bIndex = productUnitIds.indexOf(
  //       b.productUnits[0].id, // Assuming you want to sort by the first productUnit
  //     );

  //     return aIndex - bIndex;
  //   });

  //   const translatedProducts = await Promise.all(
  //     products.map(async (product) => {
  //       const translation = product.textContent.translations.find(
  //         (translation) => translation.code === query.language,
  //       );

  //       const translatedText = translation
  //         ? translation.translation
  //         : product.textContent.originalText;

  //       const translatedProductUnits = await Promise.all(
  //         product.productUnits.map(async (unit) => {
  //           const unitTranslation = unit.textContent.translations.find(
  //             (translation) => translation.code === query.language,
  //           );

  //           const translatedUnitText = unitTranslation
  //             ? unitTranslation.translation
  //             : unit.textContent.originalText;

  //           const translatedUnitContent =
  //             unit.unit.textContent.translations.find(
  //               (translation) => translation.code === query.language,
  //             );

  //           const translatedUnitContentText = translatedUnitContent
  //             ? translatedUnitContent.translation
  //             : unit.unit.textContent.originalText;

  //           return {
  //             id: unit.id,
  //             unitId: unit.unitId,
  //             quantity: unit.quantity,
  //             price: unit.price,
  //             translatedText:
  //               translatedUnitText || unit.textContent.originalText,
  //             translatedUnitText:
  //               translatedUnitContentText || unit.unit.textContent.originalText,
  //           };
  //         }),
  //       );

  //       const discount = product.discounts[0];
  //       const discountSpecificUsers = product.discountSpecificUsers[0];

  //       const favoriteProduct =
  //         await this.favoriteProductService.findOneByUserAndProduct(
  //           userId,
  //           product.id,
  //         );

  //       let discountPercent: number = 0;
  //       let discountId: any = null;

  //       if (discount) {
  //         discountPercent = discount.percent;
  //         discountId = discount.id;
  //       } else if (discountSpecificUsers) {
  //         discountPercent = discountSpecificUsers.percent;
  //         discountId = discountSpecificUsers.id;
  //       }

  //       return {
  //         id: product.id,
  //         image: product.image,
  //         barCode: product.barCode,
  //         parentCategoryId: product.parentCategoryId,
  //         isFavorite: favoriteProduct ? true : false,
  //         discount: discountPercent,
  //         discountId: discountId,
  //         translatedText: translatedText || product.textContent.originalText,
  //         translatedProductUnits,
  //       };
  //     }),
  //   );

  //   return {
  //     count,
  //     translatedProducts,
  //   };
  // }

  findOne(id: number) {
    return this.productRepository.findOneBy({ id, isDeleted: 0 });
  }

  async findOneWithQuantity(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.textContent', 'textContent')

      .leftJoin(
        'product.productUnits',
        'productUnits',
        'productUnits.isDeleted = 0',
      )
      .leftJoin('productUnits.textContent', 'productUnitsTextContent')
      .select([
        'product.id',
        'textContent.id',
        'textContent.code',
        'textContent.originalText',
        'productUnits.id',
        'productUnits.quantity',
        'productUnitsTextContent',
      ])
      .getOne();
  }

  findOneWithSimpleRelationsForUpdating(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.category', 'category')
      .leftJoin('category.textContent', 'categoryTextContent')
      .leftJoin('product.textContent', 'textContent')
      .leftJoin('textContent.translations', 'translations')
      .leftJoin('product.favoriteProducts', 'favoriteProducts')
      .select([
        'product.id',
        'product.image',
        'product.barCode',
        'product.parentCategoryId',
        'category.id',
        'category.image',
        'categoryTextContent',
        'textContent.id',
        'textContent.code',
        'textContent.originalText',
        'translations.id',
        'translations.code',
        'translations.translation',
      ])
      .getOne();
  }

  async findOneWithRelations(
    id: number,
    language: LanguageQuery,
    req: Request,
  ) {
    const userId = getUserId(req);

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.textContent', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect(
        'product.productUnits',
        'productUnits',
        'productUnits.isDeleted = 0',
      )
      .leftJoinAndSelect('productUnits.textContent', 'productUnitTextContent')
      .leftJoinAndSelect(
        'productUnitTextContent.translations',
        'productUnitTranslations',
      )
      .leftJoinAndSelect('productUnits.unit', 'unit', 'unit.isDeleted = 0')
      .leftJoinAndSelect('unit.textContent', 'unitTextContent')
      .leftJoinAndSelect('unitTextContent.translations', 'unitTranslations')
      .leftJoinAndSelect('product.discounts', 'discounts')
      .leftJoinAndSelect(
        'product.discountSpecificUsers',
        'discountSpecificUsers',
      )
      .leftJoinAndSelect('product.tax', 'tax', 'product.taxId IS NOT NULL')
      .leftJoinAndSelect('tax.textContent', 'taxTextContent')
      .leftJoinAndSelect('taxTextContent.translations', 'taxTranslation')
      .where('product.isDeleted = 0')
      .andWhere('product.id = :id', { id })
      .getOne();

    if (!product) {
      return null;
    }

    const translation = product.textContent.translations.find(
      (translation) => translation.code === language.language,
    );

    const translatedText = translation
      ? translation.translation
      : product.textContent.originalText;

    const translatedProductUnits = product.productUnits.map((productUnit) => {
      const unitTranslation = productUnit.textContent.translations.find(
        (translation) => translation.code === language.language,
      );

      const translatedUnitText = unitTranslation
        ? unitTranslation.translation
        : productUnit.textContent.originalText;

      const translatedUnitContent =
        productUnit.unit.textContent.translations.find(
          (translation) => translation.code === language.language,
        );

      const translatedUnitContentText = translatedUnitContent
        ? translatedUnitContent.translation
        : productUnit.unit.textContent.originalText;

      return {
        id: productUnit.id,
        unitId: productUnit.unitId,
        quantity: productUnit.quantity,
        price: productUnit.price,
        translatedText:
          translatedUnitText || productUnit.textContent.originalText,
        translatedUnitText:
          translatedUnitContentText ||
          productUnit.unit.textContent.originalText,
      };
    });

    const discount = product.discounts[0];

    const discountSpecificUsers = product.discountSpecificUsers[0];

    let discountPercent: number = 0;
    let discountId: any = null;

    if (discount) {
      discountPercent = discount.percent;
      discountId = discount.id;
    } else if (discountSpecificUsers) {
      discountPercent = discountSpecificUsers.percent;
      discountId = discountSpecificUsers.id;
    }

    let taxTranslation = null,
      translatedTaxPercent = null,
      taxPercent = 0;
    if (product.tax) {
      taxTranslation = product.tax.textContent.translations.find(
        (translation) => translation.code === language.language,
      );

      translatedTaxPercent = taxTranslation
        ? taxTranslation.translation
        : product.tax.textContent.originalText;

      taxPercent = product.tax.percent;
    }

    const isFavorite =
      await this.favoriteProductService.findOneByUserAndProduct(userId, id);

    if (isFavorite) product['isFavorite'] = true;
    else product['isFavorite'] = false;

    return {
      id: product.id,
      image: product.image,
      barCode: product.barCode,
      parentCategoryId: product.parentCategoryId,
      isFavorite: product['isFavorite'],
      discount: discount ? discount.percent : 0,
      discountId: discount ? discount.id : null,
      type: discount ? 'normalDiscount' : 'discountSpecificUsers',
      translatedText: translatedText || product.textContent.originalText,
      translatedProductUnits,
      translatedTaxPercent,
      taxPercent,
    };
  }

  findOneWithTaxRelationsForUpdating(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.textContent', 'textContent')
      .leftJoin('product.tax', 'tax', 'product.taxId IS NOT NULL')
      .leftJoin('tax.textContent', 'taxTextContent')
      .select([
        'product.id',
        'textContent.id',
        'textContent.code',
        'textContent.originalText',
        'tax.id',
        'tax.percent',
        'taxTextContent',
      ])
      .getOne();
  }

  findOneWithComplexRelationsForUpdating(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.textContent', 'textContent')
      .leftJoin('product.productUnits', 'productUnits')
      .andWhere('productUnits.isDeleted = 0')
      .leftJoin('productUnits.textContent', 'productUnitsTextContent')
      .leftJoin(
        'productUnitsTextContent.translations',
        'productUnitsTranslations',
      )
      .leftJoin('productUnits.unit', 'unit', 'unit.isDeleted = 0')
      .leftJoin('unit.textContent', 'unitTextContent')
      .select([
        'product.id',
        'textContent.id',
        'textContent.code',
        'textContent.originalText',
        'productUnits.id',
        'productUnits.price',
        'unit',
        'unitTextContent',
        'productUnitsTextContent',
        'productUnitsTranslations',
      ])
      .getOne();
  }

  async updateProductTax(productId: number, taxIdDto: TaxIdDto) {
    const product = await this.findOne(productId);
    product.taxId = taxIdDto.taxId;
    await this.productRepository.save(product);
    return { message: 'Product updated successfully' };
  }

  async updateQuantity(
    id: number,
    updateProductQuantityDtoList: UpdateProductQuantityDto[],
  ) {
    const productUnits = await this.productUnitRepository
      .createQueryBuilder('productUnits')
      .where('productUnits.productId = :id', { id })
      .andWhere('productUnits.isDeleted = 0')
      .select(['productUnits.id', 'productUnits.quantity'])
      .getMany();

    if (updateProductQuantityDtoList.length > 0) {
      for (const updateProductUnit of updateProductQuantityDtoList) {
        const { id, quantity } = updateProductUnit;

        const existingProductUnit = productUnits.find((p) => p.id === id);

        if (existingProductUnit) {
          existingProductUnit.quantity = quantity;
        }
      }
    }
    return this.productUnitRepository.save(productUnits);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        productUnits: true,
        discounts: true,
        category: true,
        favoriteProducts: true,
        discountSpecificUsers: true,
      },
    });
    product.isDeleted = 1;
    const savedProduct = await this.productRepository.save(product);

    for (const discount of product.discounts) {
      await this.discountRepository.remove(discount);
    }

    for (const favoriteProduct of product.favoriteProducts) {
      await this.favoriteProductRepository.remove(favoriteProduct);
    }

    for (const discountSpecificUser of product.discountSpecificUsers) {
      await this.discountSpecificUserRepository.remove(discountSpecificUser);
    }

    for (const productUnit of product.productUnits) {
      productUnit.isDeleted = 1;
    }
    await this.productUnitRepository.save(product.productUnits);

    const anotherProduct = await this.productRepository.findOne({
      where: { parentCategoryId: product.parentCategoryId, isDeleted: 0 },
    });
    if (!anotherProduct) {
      product.category.typeName = CategoryTypeEnum.UNKNOWN;
      await this.categoryRepository.save(product.category);
    }

    return savedProduct;
  }
}
