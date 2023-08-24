import { Injectable } from '@nestjs/common';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductUnit } from './entities/product-unit.entity';
import { In, Repository } from 'typeorm';
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

  findOne(id: number) {
    return this.productUnitRepository.findOneBy({ id, isDeleted: 0 });
  }

  async update(
    productUnitId: number,
    updateProductUnitDto: UpdateProductUnitDto,
  ) {
    const productUnit = await this.findOne(productUnitId);
    let price = productUnit.price;
    if (updateProductUnitDto[0].price) price = updateProductUnitDto[0].price;
    let unitId = productUnit.unitId;
    if (updateProductUnitDto[0].unitId) unitId = updateProductUnitDto[0].unitId;

    return this.productUnitRepository.save({
      ...productUnit,
      unitId,
      price,
    });
  }

  async remove(productUnitId: number) {
    const productUnit = await this.findOne(productUnitId);
    productUnit.isDeleted = 1;
    return this.productUnitRepository.save(productUnit);
  }

  findByProductId(productId: number) {
    return this.productUnitRepository.find({
      where: { productId, isDeleted: 0 },
      relations: ['textContent', 'textContent.translations'],
    });
  }
}
