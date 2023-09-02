import { Order } from 'src/modules/order/entities/order.entity';
import { ProductUnit } from 'src/modules/product-unit/entities/product-unit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productUnitId: number;

  @Column()
  orderId: number;

  @Column()
  amount: number;

  @Column()
  totalPrice: number;

  @ManyToOne(() => ProductUnit, (ProductUnit) => ProductUnit.productOrders)
  productUnit: ProductUnit;

  @ManyToOne(() => Order, (order) => order.productOrders, {
    onDelete: 'CASCADE',
  })
  order: Order;
}
