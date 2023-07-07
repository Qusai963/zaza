import { SignInDto } from './dto/sign-in.dto';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async validateUser(userName: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { userName },
      select: { password: true },
    });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }

  public async logIn(signInDto: SignInDto): Promise<any> {
    const user = await this.userService.findByUserName(signInDto.userName);
    const { password, ...results } = user;
    return {
      accessToken: await this.generateToken(user),
      user: results,
    };
  }

  public async create(createUserDto: CreateUserDto) {
    const password = await this.hashPassword(createUserDto.password);

    const user = await this.userService.create({
      ...createUserDto,
      password,
    });

    const accessToken = await this.generateToken(user);

    return { accessToken, user };
  }

  public async profile(userId: number) {
    const user = await this.userService.findById(userId);
    return user;
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
