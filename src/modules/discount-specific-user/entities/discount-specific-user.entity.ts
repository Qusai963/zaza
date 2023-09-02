import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
@Entity()
export class DiscountSpecificUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  userId: number;

  @Column()
  percent: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.discountSpecificUsers)
  product: Product;

  @ManyToOne(() => User, (user) => user.discountSpecificUsers)
  user: User;
}
