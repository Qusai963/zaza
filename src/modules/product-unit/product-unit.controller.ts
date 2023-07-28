import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductUnitService } from './product-unit.service';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';

@Controller('product-unit')
export class ProductUnitController {
  constructor(private readonly productUnitService: ProductUnitService) {}

  @Post()
  create(@Body() createProductUnitDto: CreateProductUnitDto) {
    return this.productUnitService.create(createProductUnitDto);
  }

  @Get()
  findAll() {
    return this.productUnitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productUnitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductUnitDto: UpdateProductUnitDto) {
    return this.productUnitService.update(+id, updateProductUnitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productUnitService.remove(+id);
  }
}
