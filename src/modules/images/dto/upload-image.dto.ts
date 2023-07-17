import { ApiProperty } from '@nestjs/swagger';

export class UploadImageBody {
  image: Express.Multer.File;
}
