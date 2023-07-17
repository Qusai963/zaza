import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { CategoryService } from '../category/category.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Repository } from 'typeorm';

@Controller('image')
export class ImagesController {
  constructor(
    private imageService: ImagesService,
    private categoryService: CategoryService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createPartner(
    @Body('categoryId') categoryId: number,
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
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    category.image = this.imageService.create(path);

    return this.categoryRepository.save(category);
  }
}
