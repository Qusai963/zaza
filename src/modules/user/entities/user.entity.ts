import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { FavoriteProduct } from 'src/modules/favorite-product/entities/favorite-product.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Phone } from 'src/modules/phone/entities/phone.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

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

  @Column({ unique: true })
  email: string;

  // @OneToMany(
  //   () => DiscountSpecificUser,
  //   (discountSpecificUser) => discountSpecificUser.user,
  // )
  // discountSpecificUsers: DiscountSpecificUser[];

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  @OneToMany(() => Phone, (phone) => phone.user)
  phones: Phone[];

  // @OneToMany(() => FavoriteProduct, (favoriteProducts) => favoriteProducts.user)
  // favoriteProducts: FavoriteProduct[];
}
