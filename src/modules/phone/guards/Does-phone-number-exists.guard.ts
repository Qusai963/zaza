import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Phone } from '../entities/phone.entity';
import { PHONE_EXISTS } from 'src/core/error/messages/phone-exists.message';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';

@Injectable()
export class DoesPhoneNumberExistGuard implements CanActivate {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const language = getLanguageFromRequest(request);
    const phones = request.body.phoneNumbers;

    const isMatched = await this.phoneRepository.find({
      where: { number: In(phones) },
      select: ['number'],
    });
    if (isMatched.length > 0)
      throw new BadRequestException(
        isMatched,
        PHONE_EXISTS.getMessage(language),
      );

    return true;
  }
}
