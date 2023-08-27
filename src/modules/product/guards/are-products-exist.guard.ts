import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from '../product.service';

@Injectable()
export class AreProductsExistGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const createDiscountDtoList = request.body.createDiscountDtoList;
    for (const dto of createDiscountDtoList) {
      const product = await this.productService.findOne(dto.productId);
      if (!product) throw new NotFoundException(`Product ${dto.productId}`);
    }
    return true;
  }
}
