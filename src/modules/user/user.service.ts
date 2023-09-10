import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationWithSearch } from 'src/core/query/pagination-with-search.query';
import { getOrderUserByCondition } from 'src/core/helpers/sort.helper';
import { UserResetPassword } from './entities/user-reset-password.entity';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserResetPassword)
    private readonly userResetPasswordRepository: Repository<UserResetPassword>,
    private readonly mailerService: MailerService,
  ) {}
  create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query: PaginationWithSearch) {
    if (!query.search) query.search = '';

    const qb = this.userRepository.createQueryBuilder('user');
    qb.where('user.userName LIKE :search', { search: `%${query.search}%` })
      .andWhere('user.userName != :username', { username: 'admin' })
      .orderBy(getOrderUserByCondition(query.sort))
      .skip((query.page - 1) * query.limit)
      .take(query.limit);

    const [users, count] = await qb.getManyAndCount();

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

  public profile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: {
        phones: true,
      },
    });
  }

  public findByIdWithRefreshToken(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      select: {
        refreshToken: true,
        email: true,
        name: true,
        id: true,
        userName: true,
      },
    });
  }

  public findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async updateRefreshToken(userId: number, hashedRefreshToken: string) {
    const user = await this.findById(userId);
    user.refreshToken = hashedRefreshToken;

    await this.userRepository.save(user);
  }

  async sendPasswordReset(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: {
        userResetPassword: true,
      },
    });
    if (!user) throw new NotFoundException('No user found with this email.');

    const userReset = user.userResetPassword[0];
    userReset.resetToken = crypto.randomBytes(32).toString('hex');
    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + 1);
    userReset.resetTokenExpire = expireDate;

    await this.userResetPasswordRepository.save(user);

    const mail = {
      to: user.email,
      from: 'noreply@example.com',
      subject: 'Password Reset',
      text: `Hello ${user.userName}, to reset your password, please click on the following link: http://localhost:3000/reset-password?token=${userReset.resetToken}`,
    };

    await this.mailerService.sendMail(mail);
  }
}
