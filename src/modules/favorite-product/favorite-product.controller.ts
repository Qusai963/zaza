import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavoriteProductService } from './favorite-product.service';
import { CreateFavoriteProductDto } from './dto/create-favorite-product.dto';
import { UpdateFavoriteProductDto } from './dto/update-favorite-product.dto';

@Controller('favorite-product')
export class FavoriteProductController {
  constructor(private readonly favoriteProductService: FavoriteProductService) {}

  @Post()
  create(@Body() createFavoriteProductDto: CreateFavoriteProductDto) {
    return this.favoriteProductService.create(createFavoriteProductDto);
  }

  @Get()
  findAll() {
    return this.favoriteProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoriteProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteProductDto: UpdateFavoriteProductDto) {
    return this.favoriteProductService.update(+id, updateFavoriteProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoriteProductService.remove(+id);
  }
}
