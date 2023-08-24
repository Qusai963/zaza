import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { PaginationWithSearch } from 'src/core/query/pagination-with-search.query';
import { getOrderByCondition } from 'src/core/helpers/sort.helper';
import { EMAIL_EXISTS } from 'src/core/error/messages/email-exists.message';
import { LanguageQuery } from 'src/core/query/language.query';
import { USER_NAME_EXISTS } from 'src/core/error/messages/user-name-exists.message';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query: PaginationWithSearch) {
    if (!query.search) query.search = '';

    const [users, count] = await this.userRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      order: getOrderByCondition(query.sort),
      where: {
        userName: Like(`%${query.search}%`),
      },
    });

    return {
      count,
      users,
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        phones: true,
      },
    });
  }

  // async update(
  //   id: number,
  //   updateUserDto: UpdateUserDto,
  //   language: LanguageQuery,
  // ) {
  //   const user = await this.findById(id);
  //   let email;
  //   let userName;
  //   if (updateUserDto.email) {
  //     email = await this.findByEmail(updateUserDto.email);
  //     if (email) {
  //       throw new ForbiddenException(
  //         EMAIL_EXISTS.getMessage(language.language),
  //       );
  //     }
  //   }
  //   if (updateUserDto.userName) {
  //     userName = await this.findByUserName(updateUserDto.userName);
  //     if (userName) {
  //       throw new ForbiddenException(
  //         USER_NAME_EXISTS.getMessage(language.language),
  //       );
  //     }
  //   }
  //   return this.userRepository.save({ ...user, ...updateUserDto });
  // }

  async remove(id: number) {
    const user = await this.findById(id);
    if (user.userName === 'admin')
      throw new ForbiddenException('Cannot remove the admin');
    return this.userRepository.remove(user);
  }

  public findByUserName(userName: string) {
    return this.userRepository.findOneBy({ userName });
  }

  public findById(userId: number) {
    return this.userRepository.findOneBy({ id: userId });
  }

  public findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }
}
