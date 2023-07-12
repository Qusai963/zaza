import { Category } from 'src/modules/category/entities/category.entity';
import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { Discount } from 'src/modules/discount/entities/discount.entity';
import { FavoriteProduct } from 'src/modules/favorite-product/entities/favorite-product.entity';
import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import { Tax } from 'src/modules/tax/entities/tax.entity';
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
  JoinColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column('double', { nullable: true })
  price: number;

  @Column({ nullable: true, unsigned: true })
  quantity: number;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  barcode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('tinyint', { default: 0, width: 1 })
  isDeleted: number;

  @Column()
  textContentId: number;

  @Column()
  userId: number;

  @Column()
  taxId: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => TextContent, (textContent) => textContent.products, {
    eager: true,
  })
  textContent: TextContent;

  @ManyToOne(() => Tax, (tax) => tax.products, { eager: true })
  @JoinColumn()
  tax: Tax;

  // @OneToMany(
  //   () => FavoriteProduct,
  //   (favoriteProduct) => favoriteProduct.product,
  // )
  // favoriteProducts: FavoriteProduct[];

  // @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  // productOrders: ProductOrder[];

  @OneToMany(() => Discount, (discount) => discount.product)
  discounts: Discount[];

  // @OneToMany(
  //   () => DiscountSpecificUser,
  //   (discountSpecificUser) => discountSpecificUser.product,
  // )
  // discountSpecificUsers: DiscountSpecificUser[];
}
