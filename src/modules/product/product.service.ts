import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { TextContent } from '../text-content/entities/text-content.entity';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { getOrderByCondition } from 'src/core/helpers/sort.helper';
import { getWhereByCondition } from 'src/core/helpers/search.helper';
import { LanguageQuery } from 'src/core/query/language.query';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';
import { UpdateProductQuantityDto } from './dto/update-product-quantity.dto';
import { TaxIdDto } from './dto/taxId-dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductUnit)
    private readonly productUnitRepository: Repository<ProductUnit>,
  ) {}
  async create(createProductDto: CreateProductDto, textContent: TextContent) {
    const product = this.productRepository.create(createProductDto);

    product.textContent = textContent;
    const newProduct = await this.productRepository.save(product);

    return this.productRepository.findOneBy({ id: newProduct.id });
  }

  findByTaxId(taxId: number) {
    return this.productRepository.findBy({ taxId, isDeleted: 0 });
  }

  async findAll(query: QueryFilter, parentCategoryId: number = -1) {
    const [products, count] = await this.productRepository.findAndCount({
      where: [
        {
          ...getWhereByCondition(query.search, parentCategoryId),
          isDeleted: 0,
        },
      ],
      order: getOrderByCondition(query.sort),
      take: query.limit,
      skip: (query.page - 1) * query.limit,
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
    return this.productRepository.findOneBy({ id, isDeleted: 0 });
  }

  async findOneWithQuantity(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.textContent', 'textContent')

      .leftJoin('product.productUnits', 'productUnits')
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

  async findOneWithRelations(id: number, language: LanguageQuery) {
    const product = await this.productRepository.findOne({
      where: { isDeleted: 0, id },
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
        'tax', // Include the tax relation
        'tax.textContent',
        'tax.textContent.translations',
      ],
    });

    if (!product) {
      return null;
    }

    const translation = product.textContent.translations.find(
      (translation) => translation.code === language.language,
    );

    const translatedText = translation
      ? translation.translation
      : product.textContent.originalText;

    const translatedProductUnits = product.productUnits.map((unit) => {
      const unitTranslation = unit.textContent.translations.find(
        (translation) => translation.code === language.language,
      );

      const translatedUnitText = unitTranslation
        ? unitTranslation.translation
        : unit.textContent.originalText;

      const translatedUnitContent = unit.unit.textContent.translations.find(
        (translation) => translation.code === language.language,
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

    const taxTranslation = product.tax.textContent.translations.find(
      (translation) => translation.code === language.language,
    );

    const translatedTaxPercent = taxTranslation
      ? taxTranslation.translation
      : product.tax.textContent.originalText;

    return {
      id: product.id,
      image: product.image,
      parentCategoryId: product.parentCategoryId,
      discount: discounts ? discounts.percent : 0,
      translatedText: translatedText || product.textContent.originalText,
      translatedProductUnits,
      translatedTaxPercent,
      taxPercent: product.tax.percent,
    };
  }

  async findAllAndCountByCategoryId(
    parentCategoryId: number,
    limit: number,
    page: number,
    code: string,
  ) {
    const [products, totalCount] = await this.productRepository.findAndCount({
      where: { parentCategoryId, isDeleted: 0 },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['textContent', 'textContent.translations'],
    });

    const translatedProducts = products.map((product) => {
      const translation = product.textContent.translations.find(
        (translation) => translation.code === code,
      );

      const translatedText = translation
        ? translation.translation
        : product.textContent.originalText;

      return {
        id: product.id,
        barCode: product.barCode,
        image: product.image,
        parentCategoryId: product.parentCategoryId,
        textContentId: product.textContentId,
        translatedText: translatedText || product.textContent.originalText,
      };
    });

    return { products: translatedProducts, count: totalCount };
  }

  findOneWithTaxRelationsForUpdating(id: number) {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .andWhere('product.isDeleted = 0')
      .leftJoin('product.textContent', 'textContent')
      .leftJoin('product.tax', 'tax')
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
      .leftJoin('productUnits.unit', 'unit')
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

  // async complexUpdate(id: number) {
  //   const productUnits = await this.productRepository
  //     .createQueryBuilder('product')
  //     .where('product.id = :id', { id })
  //     .andWhere('product.isDeleted = 0')
  //     .leftJoin('product.productUnits', 'productUnits')
  //     .leftJoin('productUnits.textContent', 'productUnitsTextContent')
  //     .leftJoin(
  //       'productUnitsTextContent.translations',
  //       'productUnitsTranslations',
  //     )
  //     .select([
  //       'product.id',
  //       'productUnits.id',
  //       'productUnits.price',
  //       'productUnits.unitId',
  //       'productUnitsTextContent',
  //       'productUnitsTranslations',
  //     ])
  //     .getOne();

  //   return productUnits;
  // }

  async updateProductTax(productId: number, taxIdDto: TaxIdDto) {
    const { id, ...product } = await this.findOne(productId);
    const newTaxId = taxIdDto.taxId;

    const cratedNewProduct = this.productRepository.create({
      ...product,
      taxId: newTaxId,
    });

    const savedNewProduct = await this.productRepository.save(cratedNewProduct);

    const productUnits = await this.productUnitRepository.findBy({
      productId,
      isDeleted: 0,
    });

    productUnits.forEach(
      (productUnit) => (productUnit.productId = +savedNewProduct.id),
    );

    await this.productUnitRepository.save(productUnits);

    product.isDeleted = 1;
    await this.productRepository.save({ id, ...product });

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
      relations: { productUnits: true },
    });
    product.isDeleted = 1;
    return this.productRepository.save(product);
  }
}
