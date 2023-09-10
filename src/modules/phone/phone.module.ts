import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Phone } from './entities/phone.entity';
import { UserResetPassword } from '../user/entities/user-reset-password.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Phone, UserResetPassword])],
  controllers: [PhoneController],
  providers: [PhoneService, JwtService, UserService],
})
export class PhoneModule {}
