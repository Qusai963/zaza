import { Module } from '@nestjs/common';
import { TextContentService } from './text-content.service';
import { TextContentController } from './text-content.controller';

@Module({
  controllers: [TextContentController],
  providers: [TextContentService]
})
export class TextContentModule {}
