import { Product } from 'src/modules/product/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
export class FavoriteProduct {

  @Column()
  productId: number;

  @Column()
  userName: string;

  @ManyToOne(() => Product, (product) => product.favoriteProducts)
  product: Product;

  // @ManyToOne(() => User, (user) => user.favoriteProducts)
  // user: User;
}
