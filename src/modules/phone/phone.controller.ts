import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { PhoneService } from './phone.service';
import { CreateMultiPhoneDto } from './dto/create-phone.dto';
import { UpdatePhoneDto } from './dto/update-phone.dto';
import { catchingError } from 'src/core/error/helper/catching-error';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DoesPhoneNumberExistGuard } from './guards/Does-phone-number-exists.guard';
import { CanCreatePhoneNumberGuard } from './guards/can-create-phone-number.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('phone')
@Controller('phone')
export class PhoneController {
  constructor(
    private readonly phoneService: PhoneService,
    @Inject(REQUEST) private request: Request,
  ) {}

  @UseGuards(
    AccessTokenGuard,
    CanCreatePhoneNumberGuard,
    DoesPhoneNumberExistGuard,
  )
  @Post()
  create(@Body() createMultiPhoneDto: CreateMultiPhoneDto) {
    try {
      const userId = getUserId(this.request);
      return this.phoneService.create(createMultiPhoneDto, userId);
    } catch (error) {
      catchingError(error, this.request);
    }
  }

  @Get()
  findAll() {
    return this.phoneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phoneService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhoneDto: UpdatePhoneDto) {
    return this.phoneService.update(+id, updatePhoneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phoneService.remove(+id);
  }
}
