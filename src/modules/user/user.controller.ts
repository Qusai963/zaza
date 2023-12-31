import { REQUEST } from '@nestjs/core';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { PaginationWithSearch } from 'src/core/query/pagination-with-search.query';
import { UserNotFoundGuard } from './guards/user-not-found.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard)
  @Get()
  findAll(@Query() query: PaginationWithSearch) {
    return this.userService.findAll(query);
  }

  @UseGuards(AccessTokenGuard, IsAdminGuard, UserNotFoundGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @UseGuards(AuthGuard, IsAdminGuard, UserNotFoundGuard)
  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Query() language: LanguageQuery,
  // ) {
  //   return this.userService.update(+id, updateUserDto, language);
  // }

  @UseGuards(AccessTokenGuard, IsAdminGuard, UserNotFoundGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    return this.userService.sendPasswordReset(email);
  }
}
