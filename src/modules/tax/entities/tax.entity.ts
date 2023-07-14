import { Product } from 'src/modules/product/entities/product.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tax {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('double')
  percent: number;

  @Column()
  name: string;

  @Column()
  textContentId: number;

  @ManyToOne(() => TextContent, (textContent) => textContent.taxes)
  @JoinColumn()
  textContent: TextContent;

  @OneToMany(() => Product, (product) => product.tax)
  products: Product[];
}
