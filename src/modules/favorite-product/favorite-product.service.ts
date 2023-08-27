import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteProduct } from './entities/favorite-product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteProductService {
  constructor(
    @InjectRepository(FavoriteProduct)
    private readonly favoriteProductRepository: Repository<FavoriteProduct>,
  ) {}
  async create(userId: number, productId: number) {
    const favorite = await this.findOneByUserAndProduct(userId, productId);

    if (favorite) return this.favoriteProductRepository.remove(favorite);

    if (!favorite) {
      const newFavorite = this.favoriteProductRepository.create({
        userId,
        productId,
      });

      return this.favoriteProductRepository.save(newFavorite);
    }
  }

  // TODO
  findAllByUserId(userId: number) {}

  findOneByUserAndProduct(userId: number, productId: number) {
    return this.favoriteProductRepository.findOneBy({
      userId,
      productId,
    });
  }
}
