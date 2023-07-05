import {
  Controller,
  Body,
  Post,
  UseGuards,
  Get,
  HttpStatus,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DoesUserExistGuard } from '../user/guards/does-user-exist.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

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

  @UseGuards(DoesUserExistGuard)
  @Post('signup')
  signUp(@Body() user: CreateUserDto) {
    return this.authService.create(user);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    const userId = getUserId(this.request);
    return await this.authService.profile(userId);
  }
}
