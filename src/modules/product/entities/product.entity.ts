import { Category } from 'src/modules/category/entities/category.entity';
import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { Discount } from 'src/modules/discount/entities/discount.entity';
import { FavoriteProduct } from 'src/modules/favorite-product/entities/favorite-product.entity';
import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ nullable: true })
  taxes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: 0 })
  isDeleted: number;

  @Column()
  textContent_id: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  // @ManyToOne(() => User, (user) => user.products)
  // user: User;

  @ManyToOne(() => TextContent, (textContent) => textContent.products)
  textContent: TextContent;

  @OneToMany(
    () => FavoriteProduct,
    (favoriteProduct) => favoriteProduct.product,
  )
  favoriteProducts: FavoriteProduct[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: ProductOrder[];

  @OneToMany(() => Discount, (discount) => discount.product)
  discounts: Discount[];

  @OneToMany(
    () => DiscountSpecificUser,
    (discountSpecificUser) => discountSpecificUser.product,
  )
  discountSpecificUsers: DiscountSpecificUser[];
}
