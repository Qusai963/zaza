import { ProductService } from './../product/product.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not, In } from 'typeorm';
import { Category } from './entities/category.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { CategoryTypeEnum } from './constants/category-enum';
import { Product } from '../product/entities/product.entity';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { PaginationWithLanguage } from 'src/core/query/pagination-with-language.query';
import { Request } from 'express';
import { Discount } from '../discount/entities/discount.entity';
import { FavoriteProduct } from '../favorite-product/entities/favorite-product.entity';
import { DiscountSpecificUser } from '../discount-specific-user/entities/discount-specific-user.entity';
import { ProductUnit } from '../product-unit/entities/product-unit.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
    @InjectRepository(DiscountSpecificUser)
    private readonly discountSpecificUserRepository: Repository<DiscountSpecificUser>,
    @InjectRepository(ProductUnit)
    private readonly productUnitRepository: Repository<ProductUnit>,
    private readonly productService: ProductService,
  ) {}
  create(parentCategoryId: number, textContent: TextContent) {
    const category = this.categoryRepository.create({
      parentCategoryId: parentCategoryId,
    });

    category.textContent = textContent;

    return this.categoryRepository.save(category);
  }

  async findAllFathers(query: PaginationWithLanguage) {
    const limit = query.limit;
    const page = query.page;
    const code = query.language;

    const categories = await this.categoryRepository.findAndCount({
      where: {
        parentCategoryId: IsNull(),
        isDeleted: false,
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['textContent', 'textContent.translations'],
    });

    const translatedCategories = categories[0].map((category) => {
      const translation = category.textContent.translations.find(
        (translation) => translation.code === code,
      );

      const translatedText = translation
        ? translation.translation
        : category.textContent.originalText;

      return {
        id: category.id,
        typeName: category.typeName,
        productsNumber: category.productsNumber,
        image: category.image,
        parentCategoryId: category.parentCategoryId,
        textContentId: category.textContentId,
        translatedText: translatedText || category.textContent.originalText,
      };
    });

    return {
      count: categories[1],
      typeName: 'root',
      categories: translatedCategories,
    };
  }

  async findOneWithChildren(
    id: number,
    query: PaginationWithLanguage,
    req: Request,
  ) {
    const limit = query.limit;
    const page = query.page;
    const code = query.language;
    const category = await this.findOneWithTextContentAndTranslations(id);

    const translatedMainCategory = category.textContent.translations.find(
      (translation) => translation.code === code,
    );

    const translatedTextForMainCategory = translatedMainCategory
      ? translatedMainCategory.translation
      : category.textContent.originalText;

    const hasCategories = await this.categoryRepository.findAndCount({
      where: {
        parentCategoryId: id,
        isDeleted: false,
      },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['textContent', 'textContent.translations'],
    });

    const numberOfCategories = hasCategories[1];

    if (numberOfCategories > 0) {
      const translatedCategories = hasCategories[0].map((category) => {
        const translation = category.textContent.translations.find(
          (translation) => translation.code === code,
        );

        const translatedText = translation
          ? translation.translation
          : category.textContent.originalText;
        return {
          id: category.id,
          productsNumber: category.productsNumber,
          typeName: category.typeName,
          parentCategoryId: category.parentCategoryId,
          image: category.image,
          textContentId: category.textContentId,
          translatedText: translatedText || category.textContent.originalText,
        };
      });

      return {
        translatedText: translatedTextForMainCategory,
        id: category.id,
        typeName: category.typeName,
        productsNumber: category.productsNumber,
        parentCategoryId: category.parentCategoryId,
        image: category.image,

        count: numberOfCategories,
        categories: translatedCategories,
      };
    }
    let queryFilter = new QueryFilter();
    queryFilter.limit = limit;
    queryFilter.page = page;
    queryFilter.language = code;

    const { translatedProducts, count: numberOfProducts } =
      await this.productService.findAll(queryFilter, req, id);

    if (numberOfProducts > 0)
      return {
        typeName: category.typeName,
        id: category.id,
        parentCategoryId: category.parentCategoryId,
        productsNumber: category.productsNumber,
        image: category.image,
        translatedText: translatedTextForMainCategory,
        count: numberOfProducts,
        translatedProducts,
      };

    return {
      id: category.id,
      parentCategoryId: category.parentCategoryId,
      typeName: category.typeName,
      productsNumber: category.productsNumber,
      image: category.image,
      translatedText: translatedTextForMainCategory,
    };
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id, isDeleted: false });
  }

  findOneWithTextContentAndTranslations(id: number) {
    return this.categoryRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['textContent', 'textContent.translations'],
    });
  }

  async findAllThatAcceptProducts(code: string) {
    const categories = await this.categoryRepository.find({
      where: {
        typeName: In([CategoryTypeEnum.UNKNOWN, CategoryTypeEnum.LEAF]),
      },
      relations: ['textContent', 'textContent.translations'],
    });

    const translatedCategories = categories.map((category) => {
      const translation = category.textContent.translations.find(
        (translation) => translation.code === code,
      );

      const translatedText = translation
        ? translation.translation
        : category.textContent.originalText;

      return {
        id: category.id,
        type: category.typeName,
        productsNumber: category.productsNumber,
        parentCategoryId: category.parentCategoryId,
        textContentId: category.textContentId,
        translatedText: translatedText || category.textContent.originalText,
      };
    });

    return translatedCategories;
  }

  async remove(id: number) {
    const queue = []; // Use queue for BFS
    const deletedCategories: number[] = []; // Keep track of deleted category IDs

    // Start with the given category
    const givenCategory = await this.findOne(id);
    queue.push(givenCategory);

    while (queue.length > 0) {
      const currentCategory = queue.shift();

      if (!currentCategory || deletedCategories.includes(currentCategory.id)) {
        continue;
      }

      // Soft delete the category
      currentCategory.isDeleted = true;
      await this.categoryRepository.save(currentCategory);

      // Add its children (sub-categories and products) to the queue
      const children = await this.categoryRepository.find({
        where: { parentCategoryId: currentCategory.id, isDeleted: false },
      });
      children.forEach((child) => queue.push(child));

      // Soft delete products associated with the current category
      const products = await this.productRepository.find({
        where: { parentCategoryId: currentCategory.id, isDeleted: 0 },
        relations: {
          discounts: true,
          discountSpecificUsers: true,
          productUnits: true,
          favoriteProducts: true,
        },
      });
      for (const product of products) {
        product.isDeleted = 1;
        const discounts = await this.discountRepository.findBy({
          productId: product.id,
        });
        await this.discountRepository.remove(discounts);

        const discountSpecificUsers =
          await this.discountSpecificUserRepository.findBy({
            productId: product.id,
          });
        await this.discountSpecificUserRepository.remove(discountSpecificUsers);

        const favoriteProducts = await this.favoriteProductRepository.findBy({
          productId: product.id,
        });
        await this.favoriteProductRepository.remove(favoriteProducts);

        const productUnits = await this.productUnitRepository.findBy({
          productId: product.id,
        });
        productUnits.forEach((productUnit) => {
          productUnit.isDeleted = 1;
        });
        await this.productUnitRepository.save(productUnits);

        await this.productRepository.save(product);
      }

      // Track deleted category IDs to avoid processing them again
      deletedCategories.push(currentCategory.id);
    }

    if (givenCategory.parentCategoryId) {
      const categoryBrother = await this.categoryRepository.findOneBy({
        parentCategoryId: +givenCategory.parentCategoryId,
        isDeleted: false,
      });
      if (!categoryBrother) {
        const parentCategory = await this.findOne(
          +givenCategory.parentCategoryId,
        );
        parentCategory.typeName = CategoryTypeEnum.UNKNOWN;
        await this.categoryRepository.save(parentCategory);
      }
    }
  }
}
