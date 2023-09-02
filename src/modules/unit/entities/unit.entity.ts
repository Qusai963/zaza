import { ProductUnit } from 'src/modules/product-unit/entities/product-unit.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  textContentId: number;

  @Column('tinyint', { default: false })
  isDeleted: boolean;

  @ManyToOne(() => TextContent, (textContent) => textContent.units, {
    onDelete: 'CASCADE',
  })
  textContent: TextContent;

  @OneToMany(() => ProductUnit, (productUnit) => productUnit.unit, {
    onDelete: 'CASCADE',
  })
  productUnits: ProductUnit[];
}
