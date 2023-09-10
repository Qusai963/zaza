import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { FavoriteProduct } from 'src/modules/favorite-product/entities/favorite-product.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Phone } from 'src/modules/phone/entities/phone.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { UserResetPassword } from './user-reset-password.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  refreshToken: string | null;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(
    () => DiscountSpecificUser,
    (discountSpecificUser) => discountSpecificUser.user,
  )
  discountSpecificUsers: DiscountSpecificUser[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Phone, (phone) => phone.user)
  phones: Phone[];

  @OneToOne(
    () => UserResetPassword,
    (userResetPassword) => userResetPassword.user,
  )
  userResetPassword: UserResetPassword;

  @OneToMany(() => FavoriteProduct, (favoriteProducts) => favoriteProducts.user)
  favoriteProducts: FavoriteProduct[];
}
