import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ProductOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  orderId: number;

  @Column()
  amount: number;

  @ManyToOne(() => Product, (product) => product.productOrders)
  product: Product;

  @ManyToOne(() => Order, (order) => order.productOrders)
  order: Order;
}
