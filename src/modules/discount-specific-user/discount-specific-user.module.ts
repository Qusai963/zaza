import { Module } from '@nestjs/common';
import { DiscountSpecificUserService } from './discount-specific-user.service';
import { DiscountSpecificUserController } from './discount-specific-user.controller';

@Module({
  controllers: [DiscountSpecificUserController],
  providers: [DiscountSpecificUserService]
})
export class DiscountSpecificUserModule {}
