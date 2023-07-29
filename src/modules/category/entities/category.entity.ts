import { Product } from 'src/modules/product/entities/product.entity';
import { TextContent } from 'src/modules/text-content/entities/text-content.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CategoryType } from './category-type.entity';
import { CategoryTypeEnum } from '../constants/category-enum';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  productsNumber: number;

  @Column({ default: null })
  parentCategoryId: number;

  @Column()
  textContentId: number;

  @Column({ default: null })
  image: string;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: CategoryTypeEnum.UNKNOWN })
  typeName: string;

  @ManyToOne(() => Category, (category) => category.categories)
  @JoinColumn({ name: 'parent_category_id' })
  category: Category;

  @ManyToOne(() => TextContent, (textContent) => textContent.categories)
  textContent: TextContent;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Category, (category) => category.category)
  categories: Category[];

  @ManyToOne(() => CategoryType, (categoryType) => categoryType.categories)
  @JoinColumn({ name: 'type_name' })
  type: CategoryType;
}
