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

  async findAll(query: QueryFilter) {
    const [products, count] = await this.productRepository.findAndCount({
      where: [{ ...getWhereByCondition(query.search), isDeleted: 0 }],
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

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
