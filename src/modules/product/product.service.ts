import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { TextContent } from '../text-content/entities/text-content.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createProductDto: CreateProductDto, textContent: TextContent) {
    const product = this.productRepository.create(createProductDto);

    product.textContent = textContent;
    const newProduct = await this.productRepository.save(product);

    return this.productRepository.findOneBy({ id: newProduct.id });
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
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
        quantityInStock: product.quantityInStock,
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
