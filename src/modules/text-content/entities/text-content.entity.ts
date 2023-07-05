import { Category } from 'src/modules/category/entities/category.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalLanguageCode: string;

  @Column()
  originalText: string;

  @ManyToOne(() => Language, (language) => language.textContents)
  language: Language;

  @OneToMany(() => Category, (category) => category.textContent)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.textContent)
  products: Product[];

  @OneToMany(() => Translation, (translation) => translation.textContent)
  translations: Translation[];
}
