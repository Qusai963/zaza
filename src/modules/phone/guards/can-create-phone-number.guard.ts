import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Phone } from '../entities/phone.entity';
import { getLanguageFromRequest } from 'src/modules/language/helper/get-language-code.helper';
import { FULL_PHONE_NUMBERS } from 'src/core/error/messages/full-phone-numbers.message';

@Injectable()
export class CanCreatePhoneNumberGuard implements CanActivate {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const language = getLanguageFromRequest(request);
    const userId = +request.user.sub;
    let phoneDto = request.body.phoneNumbers;
    phoneDto = phoneDto.length;

    const phoneNumbers = await this.phoneRepository.countBy({ userId });

    if (phoneNumbers + phoneDto > 3)
      throw new ForbiddenException(FULL_PHONE_NUMBERS.getMessage(language));
    return true;
  }
}
