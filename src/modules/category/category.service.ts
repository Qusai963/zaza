import { ProductService } from './../product/product.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not, In } from 'typeorm';
import { Category } from './entities/category.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { CategoryTypeEnum } from './constants/category-enum';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(TextContent)
    private readonly textContentRepository: Repository<TextContent>,
    private readonly productService: ProductService,
  ) {}
  create(parentCategoryId: number, textContent: TextContent) {
    const category = this.categoryRepository.create({
      parentCategoryId: parentCategoryId,
    });

    category.textContent = textContent;

    return this.categoryRepository.save(category);
  }

  async findAllFathers(limit: number, page: number, code: string) {
    const categories = await this.categoryRepository.findAndCount({
      where: {
        parentCategoryId: IsNull(),
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
        type: category.typeName,
        productsNumber: category.productsNumber,
        parentCategoryId: category.parentCategoryId,
        textContentId: category.textContentId,
        translatedText: translatedText || category.textContent.originalText,
      };
    });

    return {
      count: categories[1],
      categories: translatedCategories,
    };
  }

  async findOneWithChildren(
    id: number,
    limit: number,
    page: number,
    code: string,
  ) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException();

    const hasCategories = await this.categoryRepository.findAndCount({
      where: {
        parentCategoryId: id,
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
          type: category.typeName,
          parentCategoryId: category.parentCategoryId,
          image: category.image,
          textContentId: category.textContentId,
          translatedText: translatedText || category.textContent.originalText,
        };
      });

      return {
        ...category,
        translatedText:
          translatedCategories[0]?.translatedText ||
          category.textContent.originalText,

        count: numberOfCategories,
        categories: translatedCategories,
      };
    }

    const { products, count: numberOfProducts } =
      await this.productService.findAllAndCountByCategoryId(
        id,
        limit,
        page,
        code,
      );

    if (numberOfProducts > 0) {
      return {
        type: category.typeName,

        ...category,
        translatedText:
          products[0]?.translatedText || category.textContent.originalText,

        count: numberOfProducts,
        products,
      };
    }

    // Retrieve the text content with translations
    const textContent = await this.textContentRepository.findOne({
      where: {
        id: category.textContentId,
      },
      relations: ['translations'],
    });

    const translation = textContent.translations.find(
      (translation) => translation.code === code,
    );

    const translatedText = translation
      ? translation.translation
      : textContent.originalText;

    return {
      ...category,
      translatedText: translatedText || textContent.originalText,
    };
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id, isDeleted: false });
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

    // Start with the given category ID
    queue.push(
      await this.categoryRepository.findOne({
        where: { id, isDeleted: false },
      }),
    );

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
      });
      for (const product of products) {
        product.isDeleted = 1;
        await this.productRepository.save(product);
      }

      // Track deleted category IDs to avoid processing them again
      deletedCategories.push(currentCategory.id);
    }
  }
}
