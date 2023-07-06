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

  @Column()
  userName: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  // @OneToMany(
  //   () => DiscountSpecificUser,
  //   (discountSpecificUser) => discountSpecificUser.user,
  // )
  // discountSpecificUsers: DiscountSpecificUser[];

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];

  // @OneToMany(() => Phone, (phone) => phone.user)
  // phones: Phone[];

  // @OneToMany(() => FavoriteProduct, (favoriteProducts) => favoriteProducts.user)
  // favoriteProducts: FavoriteProduct[];
}
