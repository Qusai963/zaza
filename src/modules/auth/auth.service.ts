import { SignInDto } from './dto/sign-in.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';

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

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return null;
    return user;
  }

  async logout(userId: number) {
    return this.userService.updateRefreshToken(userId, null);
  }

  public async logIn(signInDto: SignInDto): Promise<any> {
    const user = await this.userService.findByUserName(signInDto.userName);
    const { password, ...results } = user;
    const tokens = await this.getTokens(+user.id, user.userName);
    await this.updateRefreshToken(+user.id, tokens.refreshToken);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: results,
    };
  }

  public async create(createUserDto: CreateUserDto) {
    const password = await this.hashData(createUserDto.password);
    return this.userService.create({
      ...createUserDto,
      password,
    });
  }

  profile(userId: number) {
    return this.userService.profile(userId);
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userService.updateRefreshToken(+userId, hashedRefreshToken);
  }

  async getTokens(userId: number, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.userName);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
