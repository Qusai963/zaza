import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageService],
})
export class LanguageModule {}
