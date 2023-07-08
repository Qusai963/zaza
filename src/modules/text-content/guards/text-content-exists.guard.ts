import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TextContent } from '../entities/text-content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DoesTextContentExistGuard implements CanActivate {
  constructor(
    @InjectRepository(TextContent)
    private readonly textContentRepository: Repository<TextContent>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const textContentId = request.body.textContentId;

    const textContent = await this.textContentRepository.findOneBy({
      id: textContentId,
    });

    if (textContent) return true;

    throw new NotFoundException('Text content not found');
  }
}
