import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { PhoneService } from './phone.service';
import { CreateMultiPhoneDto } from './dto/create-phone.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { getUserId } from '../user/helper/get-user-id.helper';
import { DoesPhoneNumberExistGuard } from './guards/Does-phone-number-exists.guard';
import { CanCreatePhoneNumberGuard } from './guards/can-create-phone-number.guard';
import { ApiTags } from '@nestjs/swagger';
import { DoesUserMatchWithPhoneNumberGuard } from './guards/does-user-match-with-phone-number.guard';

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
    const userId = getUserId(this.request);
    return this.phoneService.create(createMultiPhoneDto, userId);
  }

  @UseGuards(AccessTokenGuard, DoesUserMatchWithPhoneNumberGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phoneService.remove(+id);
  }
}
