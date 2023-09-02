import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DoesUserExistGuard } from '../user/guards/does-user-exist.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { catchingError } from 'src/core/error/helper/catching-error';
import { IsAdminGuard } from './guards/is-admin.guard';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.logIn(signInDto);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard, DoesUserExistGuard)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  async getProfile() {
    const userId = getUserId(this.request);
    return await this.authService.profile(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = getUserId(req);
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
