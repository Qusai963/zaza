import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@Entity()
export class ProductOrder {
  @Column()
  product_id: number;

  @Column()
  order_id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Product, (product) => product.productOrders)
  product: Product;

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Order;
}
