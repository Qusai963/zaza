import { Category } from 'src/modules/category/entities/category.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Tax } from 'src/modules/tax/entities/tax.entity';
import { Translation } from 'src/modules/translation/entities/translation.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity()
export class TextContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalText: string;

  @ManyToOne(() => Language, (language) => language.textContents)
  @JoinColumn({ name: 'original_language_code' })
  language: Language;

  @Column('char', { length: 5, default: 'de' })
  originalLanguageCode: string;

  @OneToMany(() => Category, (category) => category.textContent)
  categories: Category[];

  @OneToMany(() => Product, (product) => product.textContent)
  products: Product[];

  @OneToMany(() => Translation, (translation) => translation.textContent)
  translations: Translation[];

  @OneToMany(() => Tax, (tax) => tax.textContent)
  taxes: Tax[];
}
