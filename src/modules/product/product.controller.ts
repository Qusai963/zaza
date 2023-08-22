import { FileInterceptor } from '@nestjs/platform-express';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DoesProductTaxExistGuard } from '../tax/guards/does-product-tax-exists.guard';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';
import { DoesCategorySafeForProductsGuard } from '../category/guards/does-parent-category-safe-for-products.guard';
import { DoesLanguageCodeForTranslationExistGuard } from '../language/guards/does-language-code-for-translation-exist.guard';
import { DoesLanguageCodeForTextContentExistGuard } from '../language/guards/does-language-code-for-textContent-exist.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateTextContentDto } from '../text-content/dto/create-text-content.dto';
import { SecondCreateTranslationDto } from '../translation/dto/create-translation.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, UpdateQueryBuilder } from 'typeorm';
import { CreateProductUnitDto } from '../product-unit/dto/create-product-unit.dto';
import { ProductUnitService } from '../product-unit/product-unit.service';
import { DoesUnitIdForProductUnitExistGuard } from './guards/does-unit-id-for-product-unit-exist.guard';
import { DoesProductUnitLanguageCodeForTextContentExistGuard } from './guards/does-product-unit-language-code-for-textContent-exist.guard';
import { DoesProductUnitLanguageCodeForTranslationExistGuard } from './guards/does-product-unit-language-code-for-translation-exist.guard';
import { QueryFilter } from 'src/core/query/query-filter.query';
import { LanguageQuery } from 'src/core/query/language.query';
import { DoesProductExistGuard } from './guards/does-product-exist.guard';
import { UpdateTextContentDto } from '../text-content/dto/update-text-content.dto';
import { UpdateSecondTranslationDtoList } from '../translation/dto/update-translation.dto';
import { UpdateProductQuantityDto } from './dto/update-product-quantity.dto';
import { DoesTaxExistInBodyGuard } from '../tax/guards/does-tax-exists-in-body.guard';
import { TaxIdDto } from './dto/taxId-dto';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productUnitService: ProductUnitService,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
    @Inject(REQUEST) private request: Request,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesProductTaxExistGuard,
    DoesCategorySafeForProductsGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
    DoesProductUnitLanguageCodeForTextContentExistGuard,
    DoesProductUnitLanguageCodeForTranslationExistGuard,
    DoesUnitIdForProductUnitExistGuard,
  )
  @Post()
  async create(
    @Body('textContent') createTextContentDto: CreateTextContentDto,
    @Body('translation') createTranslationDtoList: SecondCreateTranslationDto[],
    @Body('product') createProductDto: CreateProductDto,
    @Body('productUnit') createProductUnitDto: CreateProductUnitDto[],
  ) {
    const createdTextContent = await this.textContentService.create(
      createTextContentDto,
    );

    const translation = await this.translationService.createMany(
      createTranslationDtoList,
      createdTextContent.id,
    );

    const createdProduct = await this.productService.create(
      createProductDto,
      createdTextContent,
    );

    const productUnit = await this.productUnitService.createMany(
      createProductUnitDto,
      +createdProduct.id,
    );

    return {
      product: createdProduct,
      textContent: createdTextContent,
      translation,
      productUnit,
    };
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() query: QueryFilter) {
    return this.productService.findAll(query);
  }

  @UseGuards(AuthGuard, DoesProductExistGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Query() language: LanguageQuery) {
    return this.productService.findOneWithRelations(+id, language);
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Get('findOneWithSimpleRelationsForUpdating/:id')
  findOneWithSimpleRelationsForUpdating(@Param('id') id: string) {
    return this.productService.findOneWithSimpleRelationsForUpdating(+id);
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Get('findOneWithTaxRelationsForUpdating/:id')
  findOneWithTaxRelationsForUpdating(@Param('id') id: string) {
    return this.productService.findOneWithTaxRelationsForUpdating(+id);
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Get('findOneWithComplexRelationsForUpdating/:id')
  findOneWithComplexRelationsForUpdating(@Param('id') id: string) {
    return this.productService.findOneWithComplexRelationsForUpdating(+id);
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Get('findOneWithQuantity/:id')
  findOneWithQuantity(@Param('id') id: string) {
    return this.productService.findOneWithQuantity(+id);
  }

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesProductExistGuard,
    DoesTaxExistInBodyGuard,
  )
  @Patch('updateTax/:id')
  updateProductTax(@Param('id') id: string, @Body() taxIdDto: TaxIdDto) {
    return this.productService.updateProductTax(+id, taxIdDto);
  }

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesProductExistGuard,
    DoesLanguageCodeForTextContentExistGuard,
    DoesLanguageCodeForTranslationExistGuard,
    DoesCategorySafeForProductsGuard,
  )
  @Patch('simpleUpdate/:id')
  async simpleUpdate(
    @Param('id') id: string,
    @Body('product') updateProductDto: UpdateProductDto,
    @Body('textContent') updateTextContentDto: UpdateTextContentDto,
    @Body('translation')
    updateSecondTranslationDtoList: UpdateSecondTranslationDtoList[],
  ) {
    const product = await this.productService.findOne(+id);

    const textContentId = product.textContentId;
    const updatedTextContent = await this.textContentService.update(
      +textContentId,
      updateTextContentDto,
    );
    const updatedTranslation = await this.translationService.update(
      textContentId,
      updateSecondTranslationDtoList,
    );

    await this.productRepository.save({ ...product, ...updateProductDto });

    return { product, updatedTextContent, updatedTranslation };
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Patch('updateQuantity/:id')
  async updateQuantity(
    @Param('id') id: string,
    @Body() updateProductQuantityDtoList: UpdateProductQuantityDto[],
  ) {
    return this.productService.updateQuantity(
      +id,
      updateProductQuantityDtoList,
    );
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductExistGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }

  @UseGuards(AuthGuard, IsAdminGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async createImage(
    @Body('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    path: Express.Multer.File,
  ) {
    const product = await this.productRepository.findOneBy({
      id: +id,
      isDeleted: 0,
    });

    if (!product) throw new NotFoundException('Product not found');

    product.image = path.filename;
    await this.productRepository.save(product);
    return product;
  }
}
