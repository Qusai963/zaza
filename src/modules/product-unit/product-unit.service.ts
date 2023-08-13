import { Injectable } from '@nestjs/common';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductUnit } from './entities/product-unit.entity';
import { Repository } from 'typeorm';
import { TranslationService } from '../translation/translation.service';
import { TextContentService } from '../text-content/text-content.service';

@Injectable()
export class ProductUnitService {
  constructor(
    @InjectRepository(ProductUnit)
    private readonly productUnitRepository: Repository<ProductUnit>,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
  ) {}
  create(createProductUnitDto: CreateProductUnitDto) {
    return 'This action adds a new productUnit';
  }

  async createMany(
    createProductUnitDto: CreateProductUnitDto[],
    productId: number,
  ) {
    const createdProductUnits = [];

    for (const productUnitDto of createProductUnitDto) {
      const createdTextContent = await this.textContentService.create(
        productUnitDto.textContent,
      );

      const translation = await this.translationService.createMany(
        productUnitDto.translation,
        createdTextContent.id,
      );

      const productUnit = this.productUnitRepository.create({
        textContentId: createdTextContent.id,
        productId,
        unitId: productUnitDto.unitId,
        price: productUnitDto.price,
        quantity: productUnitDto.quantity,
      });
      const createdProductUnit = await this.productUnitRepository.save(
        productUnit,
      );
      createdProductUnits.push({
        createdProductUnit,
        textContent: createdTextContent,
        translation,
      });
    }
    return createdProductUnits;
  }

  findAll() {
    return `This action returns all productUnit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productUnit`;
  }

  update(id: number, updateProductUnitDto: UpdateProductUnitDto) {
    return `This action updates a #${id} productUnit`;
  }

  remove(id: number) {
    return `This action removes a #${id} productUnit`;
  }
}
