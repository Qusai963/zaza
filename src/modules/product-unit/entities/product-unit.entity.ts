import { Product } from 'src/modules/product/entities/product.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import { Unit } from 'src/modules/unit/entities/unit.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  textContentId: number;

  @Column()
  productId: number;

  @Column()
  unitId: number;

  @ManyToOne(() => Product, (product) => product.productUnits)
  product: Product;

  @ManyToOne(() => Unit, (unit) => unit.productUnits)
  unit: Unit;

  @ManyToOne(() => TextContent, (textContent) => textContent.productUnits, {
    onDelete: 'CASCADE',
  })
  textContent: TextContent;
}
