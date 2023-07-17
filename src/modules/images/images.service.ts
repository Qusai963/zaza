import { Injectable } from '@nestjs/common';

@Injectable()
export class ImagesService {
  create(image: Express.Multer.File) {
    return image.filename;
  }
}
