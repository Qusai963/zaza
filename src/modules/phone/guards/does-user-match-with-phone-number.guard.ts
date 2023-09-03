import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Phone } from '../entities/phone.entity';

@Injectable()
export class DoesUserMatchWithPhoneNumberGuard implements CanActivate {
  constructor(
    @InjectRepository(Phone)
    private readonly phoneRepository: Repository<Phone>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const userId = +request.user.sub;
    let id = request.params.id;

    const phoneNumbers = await this.phoneRepository.findOneBy({
      id,
      userId,
    });

    if (!phoneNumbers) throw new ForbiddenException();
    return true;
  }
}
