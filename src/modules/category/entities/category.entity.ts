import { Product } from 'src/modules/product/entities/product.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  number: number;

  @Column({ default: null })
  categoryId: number;

  @Column()
  textContentId: number;

  @ManyToOne(() => Category, (category) => category.categories)
  category: Category;

  @ManyToOne(() => TextContent, (textContent) => textContent.categories)
  textContent: TextContent;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Category, (category) => category.category)
  categories: Category[];
}
