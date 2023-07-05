import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from 'typeorm';
@Entity()
export class DiscountSpecificUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  products_id: number;

  @Column()
  user_name: string;

  @ManyToOne(() => Product, product => product.discountSpecificUsers)
  product: Product;

  @ManyToOne(() => User, user => user.discountSpecificUsers)
  user: User;
}