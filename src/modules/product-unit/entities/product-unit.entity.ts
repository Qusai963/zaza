import { ProductOrder } from 'src/modules/product-order/entities/product-order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Unit } from 'src/modules/unit/entities/unit.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  unitId: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  isDeleted: number;

  @Column({ nullable: true, unsigned: true, default: 0 })
  quantity: number;

  @Column()
  textContentId: number;

  @Column('double', { nullable: true })
  price: number;

  @ManyToOne(() => Product, (product) => product.productUnits)
  product: Product;

  @ManyToOne(() => Unit, (unit) => unit.productUnits)
  unit: Unit;

  @ManyToOne(() => TextContent, (textContent) => textContent.productUnits, {
    onDelete: 'CASCADE',
  })
  textContent: TextContent;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.productUnit)
  productOrders: ProductOrder[];
}
