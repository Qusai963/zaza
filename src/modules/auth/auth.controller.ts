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
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DoesUserExistGuard } from '../user/guards/does-user-exist.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { catchingError } from 'src/core/error/helper/catching-error';

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
    try {
      return await this.authService.logIn(signInDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(DoesUserExistGuard)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.create(createUserDto);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile() {
    try {
      const userId = getUserId(this.request);
      return await this.authService.profile(userId);
    } catch (error) {
      catchingError(error, this.request);
    }
  }
}
