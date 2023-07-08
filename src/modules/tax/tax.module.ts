import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxController } from './tax.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tax } from './entities/tax.entity';
import { TextContent } from '../text-content/entities/text-content.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tax, TextContent])],
  controllers: [TaxController],
  providers: [TaxService],
})
export class TaxModule {}
