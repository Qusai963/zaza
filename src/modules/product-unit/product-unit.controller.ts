import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductUnitService } from './product-unit.service';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { DoesProductExistGuard } from '../product/guards/does-product-exist.guard';
import { DoesProductUnitLanguageCodeForTextContentExistGuard } from '../product/guards/does-product-unit-language-code-for-textContent-exist.guard';
import { DoesProductUnitLanguageCodeForTranslationExistGuard } from '../product/guards/does-product-unit-language-code-for-translation-exist.guard';
import { DoesUnitIdForProductUnitExistGuard } from '../product/guards/does-unit-id-for-product-unit-exist.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DoesProductUnitExistGuard } from './guards/does-product-unit-exist.guard';
import { TextContentService } from '../text-content/text-content.service';
import { TranslationService } from '../translation/translation.service';

@Controller('product-unit')
export class ProductUnitController {
  constructor(
    private readonly productUnitService: ProductUnitService,
    private readonly textContentService: TextContentService,
    private readonly translationService: TranslationService,
  ) {}

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesProductExistGuard,
    DoesProductUnitLanguageCodeForTextContentExistGuard,
    DoesProductUnitLanguageCodeForTranslationExistGuard,
    DoesUnitIdForProductUnitExistGuard,
  )
  @Post(':id')
  createMany(
    @Body('productUnit') createProductUnitDto: CreateProductUnitDto[],
    @Param('id') productId: string,
  ) {
    return this.productUnitService.createMany(createProductUnitDto, +productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productUnitService.findOne(+id);
  }

  @UseGuards(
    AuthGuard,
    IsAdminGuard,
    DoesProductUnitExistGuard,
    DoesProductUnitLanguageCodeForTextContentExistGuard,
    DoesProductUnitLanguageCodeForTranslationExistGuard,
    DoesUnitIdForProductUnitExistGuard,
  )
  @Patch(':productUnitId')
  async update(
    @Param('productUnitId') productUnitId: string,
    @Body('productUnit') updateProductUnitDto: UpdateProductUnitDto,
  ) {
    const productUnit = await this.productUnitService.findOne(+productUnitId);

    const textContentId = productUnit.textContentId;

    const updatedTextContent = await this.textContentService.update(
      +textContentId,
      updateProductUnitDto[0].textContent,
    );

    const updatedTranslation = await this.translationService.update(
      textContentId,
      updateProductUnitDto[0].translation,
    );

    await this.productUnitService.update(+productUnitId, updateProductUnitDto);

    return { message: 'Updated product Successfully' };
  }

  @UseGuards(AuthGuard, IsAdminGuard, DoesProductUnitExistGuard)
  @Delete(':productUnitId')
  remove(@Param('productUnitId') id: string) {
    return this.productUnitService.remove(+id);
  }
}
