import { Category } from 'src/modules/category/entities/category.entity';
import { DiscountSpecificUser } from 'src/modules/discount-specific-user/entities/discount-specific-user.entity';
import { Discount } from 'src/modules/discount/entities/discount.entity';
import { FavoriteProduct } from 'src/modules/favorite-product/entities/favorite-product.entity';
import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import { ProductUnit } from 'src/modules/product-unit/entities/product-unit.entity';
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
  parentCategoryId: number;

  @Column({ nullable: true, unsigned: true })
  quantityInStock: number;

  @Column({ nullable: true, default: null })
  image: string;

  @Column({ nullable: true })
  barCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('tinyint', { default: 0, width: 1 })
  isDeleted: number;

  @Column()
  textContentId: number;

  @Column()
  taxId: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_category_id' })
  category: Category;

  @ManyToOne(() => TextContent, (textContent) => textContent.products, {
    onDelete: 'CASCADE',
  })
  textContent: TextContent;

  @ManyToOne(() => Tax, (tax) => tax.products)
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

  @OneToMany(() => ProductUnit, (productUnit) => productUnit.product)
  productUnits: ProductUnit[];
}
