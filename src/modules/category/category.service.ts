import { ProductService } from './../product/product.service';
import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository, In } from 'typeorm';
import { Category } from './entities/category.entity';
import { TextContent } from '../text-content/entities/text-content.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
          translatedText: translatedText || category.textContent.originalText, // Use originalText if translatedText is empty
        };
      });

      return {
        type: 'category',
        count: numberOfCategories,
        categories: translatedCategories,
      };
    }

    const hasProducts = this.productService.findAllAndCountByCategoryId(
      id,
      limit,
      page,
    );

    const numberOfProducts = hasProducts[1];

    if (numberOfProducts > 0)
      return {
        type: 'product',
        count: numberOfProducts,
        products: hasProducts[1],
      };

    return null;
  }

  findOne(id: number) {
    return this.categoryRepository.findOneBy({ id });
  }

  async findAllWithProducts(code: string) {
    const categoriesIds = await this.productRepository.find({
      select: ['categoryId'],
    });

    const categories = await this.categoryRepository.find({
      where: { id: In(categoriesIds.map((product) => product.categoryId)) },
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
