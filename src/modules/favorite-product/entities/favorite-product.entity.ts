import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class FavoriteProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  userId: number;

  @ManyToOne(() => Product, (product) => product.favoriteProducts)
  product: Product;

  @ManyToOne(() => User, (user) => user.favoriteProducts)
  user: User;
}
