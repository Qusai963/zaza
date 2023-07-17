import { ProductService } from './../product/product.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, Not, In } from 'typeorm';
import { Category } from './entities/category.entity';
import { TextContent } from '../text-content/entities/text-content.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(TextContent)
    private readonly textContentRepository: Repository<TextContent>,
    private readonly productService: ProductService,
  ) {}
  create(parentCategoryId: number, textContent: TextContent) {
    const category = this.categoryRepository.create({
      categoryId: parentCategoryId,
    });

    category.textContent = textContent;

    return this.categoryRepository.save(category);
  }

  async findAllFathers(limit: number, page: number, code: string) {
    const categories = await this.categoryRepository.findAndCount({
      where: {
        categoryId: IsNull(),
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
        number: category.number,
        categoryId: category.categoryId,
        textContentId: category.textContentId,
        translatedText: translatedText || category.textContent.originalText, // Use originalText if translatedText is empty
      };
    });

    return {
      count: categories[1],
      categories: translatedCategories,
    };
  }

  async findAllChildren(id: number, limit: number, page: number, code: string) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException();

    const hasCategories = await this.categoryRepository.findAndCount({
      where: {
        categoryId: id,
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
          number: category.number,
          categoryId: category.categoryId,
          textContentId: category.textContentId,
          translatedText: translatedText || category.textContent.originalText,
        };
      });

      return {
        type: 'category',
        category: {
          ...category,
          translatedText:
            translatedCategories[0]?.translatedText ||
            category.textContent.originalText,
        },
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
        type: 'product',
        category: {
          ...category,
          translatedText:
            products[0]?.translatedText || category.textContent.originalText,
        },
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
    return this.categoryRepository.findOneBy({ id });
  }

  async findAllThatAcceptAddition(code: string) {
    const parentCategoriesIds = (
      await this.categoryRepository.find({
        select: ['categoryId'],
      })
    ).map((category) => category.categoryId);

    const categories = await this.categoryRepository.find({
      where: { id: Not(In(parentCategoriesIds)) },
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
        number: category.number,
        categoryId: category.categoryId,
        textContentId: category.textContentId,
        translatedText: translatedText || category.textContent.originalText, // Use originalText if translatedText is empty
      };
    });

    return translatedCategories;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    if (category) return this.categoryRepository.remove(category);
  }
}
